document.addEventListener('DOMContentLoaded', () => {
    const reviewList = document.getElementById('review-list');
    const noteList = document.getElementById('note-list');
    const viewer = document.getElementById('viewer');
    const pathDisplay = document.getElementById('current-path');
    const searchInput = document.getElementById('search-input');
    
    // 全局数据缓存
    let globalData = { reviews: [], notes: [] };

    // 初始化时钟
    setInterval(() => {
        document.getElementById('system-time').innerText = new Date().toLocaleTimeString();
    }, 1000);

    // 初始化 Marked
    const renderer = new marked.Renderer();
    marked.setOptions({ renderer: renderer, highlight: (code, lang) => hljs.highlightAuto(code).value });

    // === 核心：加载 data.json ===
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            globalData = data;
            
            // 更新统计数据
            document.getElementById('count-reviews').innerText = data.reviews.length;
            document.getElementById('count-notes').innerText = data.notes.length;

            // 初始渲染
            renderLists(data.reviews, data.notes);
        })
        .catch(err => {
            console.error("加载失败:", err);
            viewer.innerHTML = `<div style="text-align:center;color:red;margin-top:20%">
                <h2>SYSTEM ERROR</h2>
                <p>无法加载 data.json</p>
                <p>请先运行 'python generate.py' 生成数据文件</p>
            </div>`;
        });

    // === 搜索功能 ===
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        
        // 过滤 Review (搜索 ID)
        const filteredReviews = globalData.reviews.filter(item => 
            item.id.toString().includes(term)
        );

        // 过滤 Notes (搜索标题)
        const filteredNotes = globalData.notes.filter(item => 
            item.title.toLowerCase().includes(term)
        );

        renderLists(filteredReviews, filteredNotes);
    });

    // === 渲染列表 ===
    function renderLists(reviews, notes) {
        reviewList.innerHTML = '';
        noteList.innerHTML = '';

        // Render Reviews
        reviews.forEach(item => {
            const el = document.createElement('div');
            el.className = 'record-item';
            el.innerHTML = `<span class="record-id">#${item.id}</span>`;
            el.onclick = () => {
                setActive(el);
                loadContent(decodeURIComponent(item.path), 'image', `REVIEW #${item.id}`);
            };
            reviewList.appendChild(el);
        });

        // Render Notes
        notes.forEach(item => {
            const el = document.createElement('div');
            el.className = 'record-item';
            
            let icon = 'fa-solid fa-file-lines';
            let type = 'markdown';
            if (item.ext === '.pdf') { icon = 'fa-solid fa-file-pdf'; type = 'pdf'; }
            else if (item.ext === '.docx') { icon = 'fa-solid fa-file-word'; type = 'docx'; }
            else if (item.ext === '.md') { icon = 'fa-brands fa-markdown'; type = 'markdown'; }

            el.innerHTML = `
                <div style="display:flex; align-items:center; overflow:hidden;">
                    <i class="${icon} note-icon"></i>
                    <span style="white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${item.title}</span>
                </div>
            `;
            el.onclick = () => {
                setActive(el);
                loadContent(decodeURIComponent(item.path), type, item.title.toUpperCase());
            };
            noteList.appendChild(el);
        });
    }

    function setActive(element) {
        document.querySelectorAll('.record-item').forEach(e => e.classList.remove('active'));
        element.classList.add('active');
    }

    // === 内容加载器 ===
    function loadContent(filePath, type, title) {
        pathDisplay.innerText = title; // 更新顶部标题
        viewer.innerHTML = '<div style="text-align:center; color:#666; margin-top:10vh;">Searching database...</div>';

        // 1. Image Gallery
        if (type === 'image') {
            viewer.innerHTML = `
                <div class="image-gallery-container">
                    <div class="gallery-header"><h2>${title}</h2></div>
                    <div id="gallery-images" class="gallery-images"></div>
                </div>`;
            loadImageSequence(filePath);
        }
        // 2. PDF
        else if (type === 'pdf') {
            renderPDFViewer(filePath);
        }
        // 3. DOCX
        else if (type === 'docx') {
            fetch(filePath).then(res => res.blob()).then(blob => {
                viewer.innerHTML = `<div id="docx-container" class="docx-wrapper"></div>`;
                docx.renderAsync(blob, document.getElementById('docx-container'), null, { className: "docx-viewer", inWrapper: true });
            });
        }
        // 4. Markdown
        else if (type === 'markdown') {
            fetch(filePath).then(res => res.text()).then(text => {
                if(text.startsWith('%PDF-')) { loadContent(filePath, 'pdf', title); return; }
                
                const baseDir = filePath.substring(0, filePath.lastIndexOf('/') + 1);
                renderer.image = (href, txt) => `<img src="${(href.startsWith('http') || href.startsWith('/')) ? href : baseDir + href}" alt="${txt}">`;
                
                viewer.innerHTML = marked.parse(text);
                document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
            });
        }
    }

    // --- PDF Logic (保留) ---
    function renderPDFViewer(url) {
        viewer.innerHTML = `
            <div class="pdf-container">
                <div class="pdf-toolbar">
                    <button class="pdf-btn" id="prev"><i class="fa-solid fa-chevron-left"></i></button>
                    <span style="color:#fff; font-family:'JetBrains Mono'; font-size:12px">PAGE <span id="page_num">--</span> / <span id="page_count">--</span></span>
                    <button class="pdf-btn" id="next"><i class="fa-solid fa-chevron-right"></i></button>
                </div>
                <canvas id="the-canvas"></canvas>
            </div>`;

        let pdfDoc = null, pageNum = 1, pageRendering = false, pageNumPending = null;
        const canvas = document.getElementById('the-canvas');
        const ctx = canvas.getContext('2d');

        pdfjsLib.getDocument(url).promise.then(pdf => {
            pdfDoc = pdf;
            document.getElementById('page_count').textContent = pdf.numPages;
            renderPage(pageNum);
        });

        function renderPage(num) {
            pageRendering = true;
            pdfDoc.getPage(num).then(page => {
                const viewport = page.getViewport({scale: 1.5});
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                page.render({canvasContext: ctx, viewport: viewport}).promise.then(() => {
                    pageRendering = false;
                    if (pageNumPending !== null) { renderPage(pageNumPending); pageNumPending = null; }
                });
            });
            document.getElementById('page_num').textContent = num;
        }
        document.getElementById('prev').onclick = () => { if(pageNum <= 1) return; pageNum--; renderPage(pageNum); };
        document.getElementById('next').onclick = () => { if(pageNum >= pdfDoc.numPages) return; pageNum++; renderPage(pageNum); };
    }

    // --- Image Sequence Logic (保留) ---
    function loadImageSequence(mainFilePath) {
        const gallery = document.getElementById('gallery-images');
        const mainImg = document.createElement('img');
        mainImg.src = mainFilePath; mainImg.className = 'gallery-img';
        gallery.appendChild(mainImg);

        let counter = 1;
        const lastDot = mainFilePath.lastIndexOf('.');
        const path = mainFilePath.substring(0, lastDot);
        const ext = mainFilePath.substring(lastDot);
        
        const probe = () => {
            const nextPath = `${path}(${counter})${ext}`;
            const img = new Image();
            img.onload = () => {
                const el = document.createElement('img');
                el.src = nextPath; el.className = 'gallery-img';
                gallery.appendChild(el);
                counter++; probe();
            };
            img.src = nextPath;
        };
        probe();
    }
});