/**
 * Global State
 */
let currentLocation = "";
let currentVersion = "in"; 
let currentLanguage = "zh";

/**
 * Data Sources
 */
const heartSutra = [
    "观自在菩萨，行深般若波罗蜜多时", "照见五蕴皆空，度一切苦厄", "色不异空，空不异色",
    "色即是空，空即是色", "是诸法空相，不生不灭", "心无罣碍，无罣碍故",
    "远离颠倒梦想，究竟涅槃", "凡所有相，皆是虚妄", "应无所住，而生其心", "本来无一物，何处惹尘埃"
];

const powerQuotes =[
"第一根K线完美且第二根是好的跟随，60%的bull trend day",
    "成功的反转往往需要结构的形成",
    "没有完美的入场点。做单是让机构推着我们走",
    "美股：圣诞节新年行情",
    "拿不住的原因：1：金额太在意 2：对目标位不自信",
    "在震荡区间，高抛低吸永远比追涨杀跌有优势。Louie在利用市场的贪婪，而你在试图跟随市场的惯性——但震荡市没有惯性。",
    "阳线十字星也算阳线，不算阴线的连续",
    "震荡区间不要随意做突破",
    "下降趋势，20根K线左右后，一根很大的阴线，可能是抛售高潮",
    "该追的时候就去追，不然要以更高的价格追",
    "竭尽型缺口：突破后没有好的跟随，立刻被补掉缺口，价格至少回到高潮起跌点上方",
    "开盘不能去赌反转，必须要看背景",
    "做反转只能在信号K的外面用stop order",
    "前12根K线不能操作",
    "OutSide Bar看包起来是阳是阴，阳就涨",
    "final flag 需要确认跟随，如果是强大趋势K，不算。如果重叠多，算",
    "一定不能在状态不好时开单",
    "窄通道里面不看三推",
    "学会保护利润。下次有机会再进来",
    "知己知彼，百战不殆。学会思考对手方的心理活动，才是本质",
    "学会享受每一个困难，去面对它",
    "学会空仓（沉默）比开仓更重要",
    "去理解市场，感受市场，读市场",
    "健康永远是第1位，只有健康了才能去革命",
    "耐心是敌人，对抗人性。对抗苦难，才能成功",
    "每天进步一点点，慢就是快，稳住自己的心态。空仓比做单更重要",
    "震荡区间突破必须等跟随",
    "看到后面的可能走势，不代表必须开仓，请考虑盈亏比和胜率",
    "等第二次确认信号开仓",
    "宽通道被反向突破，75%概率测试起点",
    "去思考对手盘，以及大资金是否动。如果我是机构，我会开仓吗"

];
const versionConfig = {
    out: {
        btnText: { zh: "出世", en: "Transcendent" },
        subtitle: { zh: "梦中悟 · 无边众生誓愿度 · 万物与我齐一", en: "Awakening in Dreams · All Things and I Are One" },
        quote: { zh: { text: "无所从来，亦无所去", source: "— 如来" }, en: { text: "Neither coming nor going", source: "— Tathagata" } },
        navItems: [
            { key: "navAbout", zh: "关于", en: "About", link: "#" },
            { key: "navPractice", zh: "修行", en: "Practice", link: "#" },
            { key: "navUniverse", zh: "宇宙", en: "Universe", link: "#" }
        ],
        motto: {
            zh: ["一切有为法", "如梦幻泡影", "如露亦如电", "应作如是观"],
            en: ["All conditioned phenomena", "Are like dreams", "Like dew drops", "Contemplate thus"],
            sourceZh: "", sourceEn: ""
        },
        tags: [
            { zh: "醒悟", en: "Awakened", hoverZh: "", hoverEn: "" },
            { zh: "自在·无烦恼", en: "Carefree", hoverZh: "", hoverEn: "" }
        ],
        cards: {
            card1: {
                title: { zh: "荧", en: "Luminescence" },
                desc: { zh: "情绪引导的星轨", en: "Star Trails of Emotion" },
                details: { zh: "在寂静中寻找共鸣，让每一份情绪都有归处", en: "Find resonance in silence." },
                link: "https://tomliu-qianyuan.github.io/yingrou/index.html"
            },
            card2: {
                title: { zh: "卜", en: "Divination" },
                desc: { zh: "有趣的悟道之门", en: "Gate to Enlightenment" },
                details: { zh: "梅花一朵，而照万物", en: "Reflecting the Universe" },
                link: "https://qianyuan-yigua.streamlit.app"
            }
        }
    },
    in: {
        btnText: { zh: "入世", en: "Worldly" },
        subtitle: { zh: "绝对理性 · 极致执行 · 强者为尊", en: "Rationality · Execution · Discipline" },
        quote: { zh: { text: "输出稳定，源于内在秩序", source: "— Alpha" }, en: { text: "Stability comes from Order", source: "— Alpha" } },
        navItems: [
            { key: "navAbout", zh: "关于", en: "About", link: "#" },
            { key: "navTrading", zh: "交易", en: "Trading", link: "#" },
            { key: "navFitness", zh: "健身", en: "Fitness", link: "#" }
        ],
        motto: {
            zh: ["其疾如风", "其徐如林", "侵掠如火", "不动如山"],
            en: ["Swift as Wind", "Gentle as Forest", "Fierce as Fire", "Solid as Mountain"],
            sourceZh: "", sourceEn: ""
        },
        tags: [
            { zh: "Alpha", en: "Alpha", hoverZh: "强势文化LeonG", hoverEn: "Dominant Culture: LeonG" },
            { zh: "交易", en: "Trading", hoverZh: "阿尔布鲁克斯，价格行为学；订单流", hoverEn: "Al Brooks PA; Order Flow" },
            { zh: "征服", en: "Conquest", hoverZh: "征服", hoverEn: "Conquest" },
            { zh: "健身", en: "Fitness", hoverZh: "徒手", hoverEn: "Callisthenics" },
            { zh: "免杀", en: "Evasion", hoverZh: "suxyds", hoverEn: "suxyds" }
        ],
        cards: {
            card1: {
                title: { zh: "易", en: "Exchange" },
                desc: { zh: "实盘交易复盘", en: "Trading Review" },
                details: { zh: "阿尔布鲁克斯（价格行为学）+德湃（订单行为学）", en: "Al Brooks(Price Action)+Delta Apex(OrderFlow Action)." },
                link: "https://tomliu-qianyuan.github.io/trading-journal"
            },
            card2: {
                title: { zh: "荧", en: "Luminescence" },
                desc: { zh: "情绪引导的星轨", en: "Star Trails of Emotion" },
                details: { zh: "在寂静中寻找共鸣", en: "Find resonance in silence." },
                link: "https://tomliu-qianyuan.github.io/yingrou/index.html"
            }
        }
    }
};

const translations = {
    "zh": {
        "title": "TomLiu | 万物与我齐一",
        "nameChinese": "刘",
        "nameEnglish": "Tom Liu",
        "sectionTitle": "我的维度",
        "sectionDescription": "点击不同维度探索我的精神世界",
        "card3Title": "码",
        "card3Desc": "更多项目",
        "card3Details": "挖掘我的代码世界",
        "guideItem1": "右上角切换【出世/入世】状态及语言。",
        "clickHint": "点击任意位置继续",
    },
    "en": {
        "title": "TomLiu | All Things and I Are One",
        "nameChinese": "Liu",
        "nameEnglish": "Tom Liu",
        "sectionTitle": "My Dimensions",
        "sectionDescription": "Explore my spiritual world",
        "card3Title": "Code",
        "card3Desc": "More Projects",
        "card3Details": "Explore my code world",
        "guideItem1": "Top right to switch Dimension/Language.",
        "clickHint": "CLICK ANYWHERE TO CONTINUE",
    }
};

/**
 * Core Functions
 */
async function showUserLocation() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=auto`);
        const data = await response.json();
        const locationParts = [data.city, data.countryName].filter(Boolean);
        currentLocation = locationParts.join(", ");
        updateLocationDisplay();
    } catch (e) {
        currentLocation = "Unknown Location";
        updateLocationDisplay();
    }
}

function updateLocationDisplay() {
    const el = document.getElementById('current-location');
    if (el) el.textContent = currentLocation;
}

function detectUserLocation() {
    showUserLocation();
    return new Promise(resolve => {
        const pref = localStorage.getItem('languagePreference');
        resolve(pref || 'zh');
    });
}

function translatePage(language) {
    currentLanguage = language;
    document.documentElement.lang = language;
    const t = translations[language];

    document.title = t.title;
    document.getElementById('toggle-zh')?.classList.toggle('active', language === 'zh');
    document.getElementById('toggle-en')?.classList.toggle('active', language === 'en');
    
    document.querySelector('.name-chinese').textContent = t.nameChinese;
    document.querySelector('.name-english').textContent = t.nameEnglish;
    document.querySelector('.section-header h2').textContent = t.sectionTitle;
    document.querySelector('.section-description').textContent = t.sectionDescription;
    
    const cards = document.querySelectorAll('.card');
    if(cards.length >= 3) {
        cards[2].querySelector('.card-title').textContent = t.card3Title;
        cards[2].querySelector('.card-description').textContent = t.card3Desc;
        cards[2].querySelector('.card-details').textContent = t.card3Details;
    }

    applyVersionContent(currentVersion);
    localStorage.setItem('languagePreference', language);
}

function switchVersion(version) {
    currentVersion = version;
    document.body.classList.remove('mode-in', 'mode-out');
    document.body.classList.add(version === 'in' ? 'mode-in' : 'mode-out');
    document.getElementById('ver-out')?.classList.toggle('active', version === 'out');
    document.getElementById('ver-in')?.classList.toggle('active', version === 'in');
    applyVersionContent(version);
}

function applyVersionContent(version) {
    const data = versionConfig[version];
    const lang = currentLanguage;

    const btnOut = document.getElementById('ver-out');
    const btnIn = document.getElementById('ver-in');
    if(btnOut) btnOut.textContent = versionConfig.out.btnText[lang];
    if(btnIn) btnIn.textContent = versionConfig.in.btnText[lang];

    const quoteText = document.querySelector('.quote-text');
    const quoteSource = document.querySelector('.quote-source');
    const subTitle = document.querySelector('.nav-subtitle');
    
    if(quoteText) quoteText.textContent = `"${data.quote[lang].text}"`;
    if(quoteSource) quoteSource.textContent = data.quote[lang].source;
    if(subTitle) subTitle.textContent = data.subtitle[lang];

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach((link, i) => {
        if(data.navItems[i]) {
            link.textContent = data.navItems[i][lang];
            link.href = data.navItems[i].link;
        }
    });

    const mottoLines = document.querySelectorAll('.motto-line');
    mottoLines.forEach((line, i) => {
        if(data.motto[lang][i]) {
            line.textContent = data.motto[lang][i];
            const sourceKey = lang === 'zh' ? 'sourceZh' : 'sourceEn';
            if (data.motto[sourceKey]) {
                line.setAttribute('data-tooltip', data.motto[sourceKey]);
            } else {
                line.removeAttribute('data-tooltip');
            }
        }
    });

    const tagsContainer = document.querySelector('.identity-tags');
    if(tagsContainer) {
        tagsContainer.innerHTML = '';
        data.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'identity-tag';
            span.textContent = tag[lang];
            const hoverKey = lang === 'zh' ? 'hoverZh' : 'hoverEn';
            if (tag[hoverKey]) span.setAttribute('data-tooltip', tag[hoverKey]);
            tagsContainer.appendChild(span);
        });
    }

    const cardWrappers = document.querySelectorAll('.card-wrapper');
    if (cardWrappers.length >= 2) {
        const c1Data = data.cards.card1;
        cardWrappers[0].querySelector('.card-title').textContent = c1Data.title[lang];
        cardWrappers[0].querySelector('.card-description').textContent = c1Data.desc[lang];
        cardWrappers[0].querySelector('.card-details').textContent = c1Data.details[lang];
        cardWrappers[0].querySelector('.card-link').href = c1Data.link;

        const c2Data = data.cards.card2;
        cardWrappers[1].querySelector('.card-title').textContent = c2Data.title[lang];
        cardWrappers[1].querySelector('.card-description').textContent = c2Data.desc[lang];
        cardWrappers[1].querySelector('.card-details').textContent = c2Data.details[lang];
        cardWrappers[1].querySelector('.card-link').href = c2Data.link;
    }
}

/**
 * --- 聚光灯式引导 (Spotlight Guide V2) ---
 * 逻辑：只引导右上角开关，不再强制引导下滑
 */
function checkAndShowGuide(lang) {
    // localStorage.removeItem('hasSeenV2Guide'); 

    const hasSeenGuide = localStorage.getItem('hasSeenV2Guide');
    
    if (!hasSeenGuide) {
        const t = translations[lang];

        const steps = [
            { 
                target: '.version-toggle', 
                text: t.guideItem1, 
                shape: 'rect',
                padding: 10,
                type: 'click' 
            }
        ];

        let currentStepIndex = 0;

        // 创建 DOM
        const spotlight = document.createElement('div');
        spotlight.className = 'guide-spotlight';
        
        const textContainer = document.createElement('div');
        textContainer.className = 'guide-text-container';
        spotlight.appendChild(textContainer);
        
        const clickLayer = document.createElement('div');
        clickLayer.className = 'guide-click-layer';

        document.body.appendChild(clickLayer);
        document.body.appendChild(spotlight);

        // 移动光圈核心函数
        const moveSpotlightTo = (stepIndex) => {
            if (stepIndex >= steps.length) {
                endGuide();
                return;
            }

            const step = steps[stepIndex];
            const targetEl = document.querySelector(step.target);

            if (!targetEl) {
                endGuide(); 
                return;
            }

            // 计算位置
            const rect = targetEl.getBoundingClientRect();
            const padding = step.padding || 20;

            spotlight.style.width = `${rect.width + padding * 2}px`;
            spotlight.style.height = `${rect.height + padding * 2}px`;
            spotlight.style.top = `${rect.top - padding}px`;
            spotlight.style.left = `${rect.left - padding}px`;

            if (step.shape === 'circle') spotlight.classList.add('circle');
            else spotlight.classList.remove('circle');

            // 渲染文字与提示
            textContainer.innerHTML = `
                <div class="guide-text-body">${step.text}</div>
                <span class="guide-text-hint click-hint">${t.clickHint}</span>
            `;
            clickLayer.style.display = 'block';
            
            spotlight.classList.add('active');
        };

        // 结束引导
        const endGuide = () => {
            spotlight.style.opacity = '0';
            clickLayer.style.display = 'none';
            
            setTimeout(() => {
                spotlight.remove();
                clickLayer.remove();
            }, 600);
            localStorage.setItem('hasSeenV2Guide', 'true');
        };

        // 点击层事件
        clickLayer.addEventListener('click', () => {
            currentStepIndex++;
            moveSpotlightTo(currentStepIndex);
        });
        
        // Resize 重新计算位置
        window.addEventListener('resize', () => {
            if(document.body.contains(spotlight)) {
                moveSpotlightTo(currentStepIndex);
            }
        });

        // 启动
        setTimeout(() => moveSpotlightTo(0), 100);
    }
}

/**
 * --- 下滑提示 (Zen Scroll Hint) ---
 * 逻辑：未下滑过 -> 显示 -> 一旦监测滚动 -> 永久消失
 */
function initScrollHint() {
    const hasScrolled = localStorage.getItem('hasGlobalScrolled');
    const hintEl = document.getElementById('scroll-hint');

    // 如果已经滑过或找不到元素，不执行
    if (hasScrolled || !hintEl) {
        if(hintEl) hintEl.remove();
        return;
    }

    // 1. 延迟显示，营造呼吸感
    setTimeout(() => {
        hintEl.classList.add('visible');
    }, 1500);

    // 2. 监听滚动事件
    const handleScrollOnce = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 阈值设为 50px，避免微小震动触发
        if (scrollTop > 50) {
            hintEl.classList.remove('visible');
            hintEl.classList.add('vanish');
            
            // 写入永久标记
            localStorage.setItem('hasGlobalScrolled', 'true');
            
            // 移除监听
            window.removeEventListener('scroll', handleScrollOnce);
            
            // 动画结束后从 DOM 移除
            setTimeout(() => {
                hintEl.remove();
            }, 1000);
        }
    };

    window.addEventListener('scroll', handleScrollOnce, { passive: true });
}

/**
 * Event Listeners
 */
document.addEventListener('DOMContentLoaded', async function() {
    const userLanguage = await detectUserLocation();
    
    document.getElementById('toggle-en')?.addEventListener('click', () => translatePage('en'));
    document.getElementById('toggle-zh')?.addEventListener('click', () => translatePage('zh'));
    document.getElementById('ver-out')?.addEventListener('click', () => switchVersion('out'));
    document.getElementById('ver-in')?.addEventListener('click', () => switchVersion('in'));

    translatePage(userLanguage);
    switchVersion(currentVersion); 

    initVisualEffects();
    
    // 启动引导
    setTimeout(() => checkAndShowGuide(userLanguage), 800);
    // 启动下滑提示
    initScrollHint();
});

document.addEventListener('click', function(e) {
    if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.card') || e.target.closest('.guide-click-layer')) return;

    // 入世模式特效：Alpha 语录浮现
    if (currentVersion === 'in') {
        const text = powerQuotes[Math.floor(Math.random() * powerQuotes.length)];
        const pop = document.createElement('div');
        pop.className = 'alpha-popup';
        pop.textContent = text;
        pop.style.left = `${e.clientX}px`;
        pop.style.top = `${e.clientY}px`;
        pop.style.animation = `alpha-fade-up 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;
        document.body.appendChild(pop);
        setTimeout(() => pop.remove(), 2500);
        return;
    }

    // 出世模式特效：心经浮现
    const popup = document.querySelector('.sutra-popup');
    if(popup) {
        const text = heartSutra[Math.floor(Math.random() * heartSutra.length)];
        popup.style.left = `${e.clientX}px`;
        popup.style.top = `${e.clientY}px`;
        popup.textContent = text;
        popup.style.opacity = '0.9';
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
        setTimeout(() => {
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
        }, 1500);
    }
});

function initVisualEffects() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    if(cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            setTimeout(() => {
                if(cursorFollower) {
                    cursorFollower.style.left = `${e.clientX}px`;
                    cursorFollower.style.top = `${e.clientY}px`;
                }
            }, 50);
        });
    }
    
    const cards = document.querySelectorAll('.card-wrapper');
    cards.forEach((wrapper) => {
        const card = wrapper.querySelector('.card');
        wrapper.addEventListener('mousemove', (e) => {
            // 在入世模式下，减少 3D 倾斜幅度，保持冷静
            const limit = currentVersion === 'in' ? 2 : 5; 
            
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -limit;
            const rotateY = ((x - centerX) / centerX) * limit;
            
            // 入世模式：平移+微倾斜；出世模式：旋转+平移
            if (currentVersion === 'in') {
                card.style.transform = `translate(-5px, -5px)`; 
            } else {
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            }
        });
        
        wrapper.addEventListener('mouseleave', () => {
             card.style.transform = 'none'; // 重置
        });
    });
}

