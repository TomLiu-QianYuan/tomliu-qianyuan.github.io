// 地理位置信息显示
let currentLocation = "";
async function showUserLocation() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        // 使用逆地理编码API获取位置信息
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=auto`);
        const data = await response.json();
        
        // 从响应中提取有用的位置信息
        const locationParts = [];
        if (data.city) locationParts.push(data.city);
        if (data.principalSubdivision) locationParts.push(data.principalSubdivision);
        if (data.countryName) locationParts.push(data.countryName);
        
        currentLocation = locationParts.join(", ");
        
        // 更新位置显示
        updateLocationDisplay();
        
        return currentLocation;
    } catch (error) {
        console.error("获取地理位置失败:", error);
        currentLocation = "位置未知";
        updateLocationDisplay();
        return null;
    }
}
function updateLocationDisplay() {
    const locationDisplay = document.getElementById('current-location');
    if (locationDisplay) {
        locationDisplay.textContent = currentLocation;
        
        // 根据语言环境调整样式
        const isChinese = document.documentElement.lang === 'zh';
        locationDisplay.style.fontFamily = isChinese ? "'Noto Serif SC', serif" : "inherit";
        locationDisplay.style.fontSize = isChinese ? "0.85rem" : "0.8rem";
    }
}

// 地区检测与翻译功能
function detectUserLocation() {
    showUserLocation();
    
    return new Promise((resolve) => {
        // 首先检查是否已有用户偏好设置
        const userPreference = localStorage.getItem('languagePreference');
        if (userPreference) {
            resolve(userPreference === 'en' ? 'en' : 'zh');
            return;
        }

        // 如果没有设置，尝试通过IP检测地区
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // 使用逆地理编码API获取国家代码
                    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=zh`)
                        .then(response => response.json())
                        .then(data => {
                            const countryCode = data.countryCode;
                            resolve(countryCode === 'CN' ? 'zh' : 'en');
                        })
                        .catch(() => {
                            // API失败时默认为中文
                            resolve('zh');
                        });
                },
                () => {
                    // 地理位置获取失败，使用备用方案
                    useBackupLocationDetection().then(resolve);
                }
            );
        } else {
            // 浏览器不支持地理位置，使用备用方案
            useBackupLocationDetection().then(resolve);
        }
    });
}

// 备用地区检测方案
function useBackupLocationDetection() {
    return new Promise((resolve) => {
        // 检查浏览器语言设置
        const browserLanguage = navigator.language || navigator.userLanguage;
        if (browserLanguage.startsWith('zh')) {
            resolve('zh');
            return;
        }

        // 使用第三方IP地理位置API
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                resolve(data.country === 'CN' ? 'zh' : 'en');
            })
            .catch(() => {
                // 所有方法都失败时默认为中文
                resolve('zh');
            });
    });
}

// 翻译映射表
const translations = {
    "zh": {
        "title": "TomLiu | 万物与我齐一",
        "navSubtitle": "梦中悟 · 无边众生誓愿度 · 万物与我齐一",
        "navAbout": "关于",
        "navPractice": "修行",
        "navUniverse": "宇宙",
        "nameChinese": "刘",
        "nameEnglish": "Tom Liu",
        "identityTag1": "醒悟",
        "identityTag2": "热爱计算机",
        "identityTag3": "热爱黑客技术(免杀)",
        "identityTag4": "自在·无烦恼",
        "quoteText": "无所从来，亦无所去",
        "quoteSource": "— 如来",
        "mottoLine1": "一切有为法",
        "mottoLine2": "如梦幻泡影",
        "mottoLine3": "如露亦如电",
        "mottoLine4": "应作如是观",
        "sectionTitle": "我的维度",
        "sectionDescription": "点击不同维度探索我的精神世界",
        "card1Title": "荧",
        "card1Desc": "情绪引导的星轨",
        "card1Details": "在寂静中寻找共鸣，让每一份情绪都有归处",
        "card2Title": "卜", 
        "card2Desc": "有趣的悟道之门",
        "card2Details": "梅花一朵，而照万物",
        "card3Title": "码",
        "card3Desc": "探索我的更多项目",
        "card3Details": "我的所有项目，待你挖掘"
    },
    "en": {
        "title": "TomLiu | All Things and I Are One",
        "navSubtitle": "Awakening in Dreams · Vow to Save All Beings · All Things and I Are One",
        "navAbout": "About",
        "navPractice": "Practice",
        "navUniverse": "Universe",
        "nameChinese": "Liu",
        "nameEnglish": "Tom Liu",
        "identityTag1": "Awakening",
        "identityTag2": "Passionate about Computing",
        "identityTag3": "Passionate about Hacking (AV Evasion)",
        "identityTag4": "Free from Worries",
        "quoteText": "Neither coming nor going",
        "quoteSource": "— Tathagata",
        "mottoLine1": "All conditioned phenomena",
        "m mottoLine2": "Are like dreams, illusions, bubbles, shadows",
        "mottoLine3": "Like dew drops and a lightning flash",
        "mottoLine4": "You should contemplate them thus",
        "sectionTitle": "My Dimensions",
        "sectionDescription": "Click on different dimensions to explore my spiritual world",
        "card1Title": "Luminescence",
        "card1Desc": "Star Trails Guided by Emotions",
        "card1Details": "Find resonance in silence, give every emotion its place",
        "card2Title": "Divination",
        "card2Desc": "The Interesting Gate to Enlightenment",
        "card2Details": "A single plum blossom reflects all things",
        "card3Title": "Code",
        "card3Desc": "Explore My More Projects",
        "card3Details": "All my projects waiting for you to discover"
    },
    "heartSutra": [
        "The Bodhisattva Avalokiteshvara, moving in the deep course of Prajna Paramita, sees the five skandhas are empty.",
        "Sariputra, form does not differ from emptiness, emptiness does not differ from form. The same is true of feelings, perceptions, impulses, consciousness.",
        "Sariputra, the characteristics of the voidness of all dharmas are non-arising, non-ceasing, non-defiled, non-pure, non-increasing, non-decreasing.",
        "Therefore, in emptiness there is no form, no feeling, no perception, no formation, no consciousness.",
        "No eye, ear, nose, tongue, body, mind; no form, sound, smell, taste, touch, phenomena.",
        "No realm of sight, no realm of consciousness, no ignorance, no end to ignorance, no old age and death, no end to old age and death.",
        "The Bodhisattva relies on Prajna Paramita and thus the mind is without hindrance. Without hindrance, there is no fear.",
        "All Buddhas of past, present and future rely on Prajna Paramita to attain Anuttara Samyak Sambodhi.",
        "Therefore know that Prajna Paramita is the great divine mantra, the great bright mantra, the supreme mantra, the incomparable mantra, which removes all suffering.",
        "The mantra is proclaimed: gate gate paragate parasamgate bodhi svaha."
    ]
};

// 翻译页面内容
function translatePage(language) {
    // 设置HTML lang属性
    document.documentElement.lang = language;
    
    // 更新标题
    document.title = translations[language].title;
    // 更新活动按钮状态
    document.getElementById('toggle-zh').classList.toggle('active', language === 'zh');
    document.getElementById('toggle-en').classList.toggle('active', language === 'en');
  
    // 导航栏
    document.querySelector('.nav-subtitle').textContent = translations[language].navSubtitle;
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks[0].textContent = translations[language].navAbout;
    navLinks[1].textContent = translations[language].navPractice;
    navLinks[2].textContent = translations[language].navUniverse;
    
    // 身份信息
    document.querySelector('.name-chinese').textContent = translations[language].nameChinese;
    document.querySelector('.name-english').textContent = translations[language].nameEnglish;
    
    // 身份标签
    const identityTags = document.querySelectorAll('.identity-tag');
    identityTags[0].textContent = translations[language].identityTag1;
    identityTags[1].textContent = translations[language].identityTag2;
    identityTags[2].textContent = translations[language].identityTag3;
    identityTags[3].textContent = translations[language].identityTag4;
    
    // 引文
    document.querySelector('.quote-text').textContent = `"${translations[language].quoteText}"`;
    document.querySelector('.quote-source').textContent = translations[language].quoteSource;
    
    // 格言
    const mottoLines = document.querySelectorAll('.motto-line');
    mottoLines[0].textContent = translations[language].mottoLine1;
    mottoLines[1].textContent = translations[language].mottoLine2;
    mottoLines[2].textContent = translations[language].mottoLine3;
    mottoLines[3].textContent = translations[language].mottoLine4;
    
    // 卡片部分
    document.querySelector('.section-header h2').textContent = translations[language].sectionTitle;
    document.querySelector('.section-description').textContent = translations[language].sectionDescription;
    
    const cards = document.querySelectorAll('.card');
    cards[0].querySelector('.card-title').textContent = translations[language].card1Title;
    cards[0].querySelector('.card-description').textContent = translations[language].card1Desc;
    cards[0].querySelector('.card-details').textContent = translations[language].card1Details;
    
    cards[1].querySelector('.card-title').textContent = translations[language].card2Title;
    cards[1].querySelector('.card-description').textContent = translations[language].card2Desc;
    cards[1].querySelector('.card-details').textContent = translations[language].card2Details;
    
    cards[2].querySelector('.card-title').textContent = translations[language].card3Title;
    cards[2].querySelector('.card-description').textContent = translations[language].card3Desc;
    cards[2].querySelector('.card-details').textContent = translations[language].card3Details;
    
    // 更新心经内容
    if (language === 'en') {
        heartSutra = translations.heartSutra;
    }
    
    // 保存用户语言偏好
    localStorage.setItem('languagePreference', language);
    updateLocationDisplay();
}

// 添加语言切换按钮
function addLanguageToggle() {
    const navContainer = document.querySelector('.nav-container');
    const languageToggle = document.createElement('div');
    languageToggle.className = 'language-toggle';
    languageToggle.innerHTML = `
        <button class="language-btn" id="toggle-en">EN</button>
        <span>/</span>
        <button class="language-btn" id="toggle-zh">中文</button>
    `;
    navContainer.querySelector('nav').appendChild(languageToggle);
    
    document.getElementById('toggle-en').addEventListener('click', () => {
        translatePage('en');
    });
    
    document.getElementById('toggle-zh').addEventListener('click', () => {
        translatePage('zh');
    });
}

// 其余原有代码保持不变...
// 添加位置显示元素
function addLocationDisplay() {
    const nav = document.querySelector('.glass-nav');
    if (nav) {
        const locationContainer = document.createElement('div');
        locationContainer.className = 'location-container';
        locationContainer.innerHTML = `
            <span class="location-icon">📍</span>
            <span id="current-location">获取位置中...</span>
        `;
        nav.appendChild(locationContainer);
    }
}
document.addEventListener('DOMContentLoaded', async function() {
    // 检测用户位置并翻译
    const userLanguage = await detectUserLocation();
    translatePage(userLanguage);
    
    // 添加语言切换事件
    document.getElementById('toggle-en').addEventListener('click', () => {
        translatePage('en');
    });
    
    document.getElementById('toggle-zh').addEventListener('click', () => {
        translatePage('zh');
    });
    // 添加语言切换按钮
    addLanguageToggle();
    addLocationDisplay();
    // 高级光标效果
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        cursorFollower.style.left = `${e.clientX}px`;
        cursorFollower.style.top = `${e.clientY}px`;
    });
    
    // 将原来的cards选择器改为
    const cards = document.querySelectorAll('.card-wrapper');
        // 修改事件监听逻辑（替换现有cards.forEach部分）
        cards.forEach((wrapper) => {
            const card = wrapper.querySelector('.card');
            const link = wrapper.querySelector('.card-link');
            
            const target = link ? link : card;
            
            target.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                // 保持原有转换逻辑...
            });
            
            target.addEventListener('mouseleave', () => {
            // 保持原有重置逻辑...
        });
    });
    // // 为无链接卡片添加点击反馈
    // document.querySelectorAll('.card-wrapper:not(:first-child) .card').forEach(card => {
    //     card.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         card.style.transform = 'translateY(-10px) scale(0.98)';
    //         setTimeout(() => {
    //             card.style.transform = 'translateY(-20px) rotateX(0) rotateY(0)';
    //         }, 150);
    //     });
    // });
    
    // 导航栏滚动效果
    const nav = document.querySelector('.glass-nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '1rem 3rem';
            nav.style.borderBottom = '1px solid rgba(194, 184, 168, 0.2)';
        } else {
            nav.style.padding = '2rem 3rem';
            nav.style.borderBottom = '1px solid rgba(194, 184, 168, 0.1)';
        }
    });
    
    // 页面淡入效果
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// 心经内容数组
const heartSutra = [
    "观自在菩萨，行深般若波罗蜜多时，照见五蕴皆空，度一切苦厄。",
    "舍利子，色不异空，空不异色，色即是空，空即是色，受想行识，亦复如是。",
    "舍利子，是诸法空相，不生不灭，不垢不净，不增不减。",
    "是故空中无色，无受想行识，无眼耳鼻舌身意，无色声香味触法。",
    "无眼界，乃至无意识界，无无明，亦无无明尽，乃至无老死，亦无老死尽。",
    "无苦集灭道，无智亦无得，以无所得故。",
    "菩提萨埵，依般若波罗蜜多故，心无罣碍。无罣碍故，无有恐怖，远离颠倒梦想，究竟涅槃。",
    "三世诸佛，依般若波罗蜜多故，得阿耨多罗三藐三菩提。",
    "故知般若波罗蜜多，是大神咒，是大明咒，是无上咒，是无等等咒，能除一切苦，真实不虚。",
    "故说般若波罗蜜多咒，即说咒曰：揭谛揭谛，波罗揭谛，波罗僧揭谛，菩提萨婆诃。"
];


// 页面加载动画
window.addEventListener('load', function() {
    // 右侧描述文字逐个出现
    const descriptions = document.querySelectorAll('.title-description');
    descriptions.forEach((desc, index) => {
        setTimeout(() => {
            desc.style.opacity = '0.9';
            desc.style.transform = 'translateX(0)';
        }, 600 + index * 200);
    });
});

// 替换原有的 click 事件监听代码为：
document.addEventListener('click', function(e) {
    if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.card')) return;
    
    const popup = document.querySelector('.sutra-popup');
    const randomSutra = heartSutra[Math.floor(Math.random() * heartSutra.length)];
    
    // 直接使用点击坐标（不再随机）
    popup.style.left = `${e.clientX}px`;
    popup.style.top = `${e.clientY}px`;
    
    popup.textContent = randomSutra;
    popup.style.opacity = '0.9';
    popup.style.transform = 'translate(-50%, -50%) scale(1)';
    
    // 1秒后消失
    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
    }, 1000);  // 严格1秒
});
