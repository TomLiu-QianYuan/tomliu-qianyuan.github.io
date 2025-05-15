document.addEventListener('DOMContentLoaded', function() {
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
