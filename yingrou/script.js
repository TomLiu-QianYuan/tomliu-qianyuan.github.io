// =========== 流星管理器 ===========
const MeteorManager = {
  meteors: [],
  lastMeteorTime: 0,
  minInterval: 10000, // 10秒
  maxInterval: 30000, // 30秒
  maxDistance: 800,   // 流星最大飞行距离
  
  init() {
    this.createMeteor();
  },
  
  createMeteor() {
    const now = Date.now();
    if (now - this.lastMeteorTime < this.minInterval) {
      setTimeout(() => this.createMeteor(), 1000);
      return;
    }
    
    const meteor = document.createElement('div');
    meteor.className = 'meteor';
    
    // 随机起始位置 (从屏幕上方或右侧进入)
    const fromTop = Math.random() > 0.5;
    const startX = fromTop ? 
      Math.random() * window.innerWidth : 
      window.innerWidth;
    const startY = fromTop ? 
      -50 : 
      Math.random() * window.innerHeight / 2;
    
    // 随机飞行角度
    const angle = fromTop ? 
      20 + Math.random() * 40 :  // 从顶部: 20-60度
      100 + Math.random() * 40; // 从右侧: 100-140度
    
    // 计算终点
    const rad = angle * Math.PI / 180;
    const endX = startX - Math.cos(rad) * this.maxDistance;
    const endY = startY + Math.sin(rad) * this.maxDistance;
    
    // 随机大小和持续时间
    const size = 1 + Math.random() * 3;
    const duration = 1 + Math.random() * 2;
    
    meteor.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${startX}px;
      top: ${startY}px;
      background: linear-gradient(to right, 
        rgba(255,255,255,0.8) 0%, 
        rgba(200,240,255,0.6) 50%, 
        transparent 100%);
      transform: rotate(${angle}deg);
      opacity: 0;
    `;
    
    document.body.appendChild(meteor);
    this.meteors.push(meteor);
    
    // 动画
    gsap.to(meteor, {
      x: endX - startX,
      y: endY - startY,
      opacity: 1,
      duration: duration,
      ease: "linear",
      onComplete: () => {
        meteor.remove();
        this.meteors = this.meteors.filter(m => m !== meteor);
      }
    });
    
    // 流星尾部拖影
    const tailLength = Math.floor(50 + Math.random() * 100);
    for (let i = 1; i <= tailLength; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'meteor-particle';
        particle.style.cssText = `
          width: ${size * (0.5 + 0.5 * i / tailLength)}px;
          height: ${size * (0.5 + 0.5 * i / tailLength)}px;
          left: ${startX + (endX - startX) * (i / tailLength)*0.1}px;
          top: ${startY + (endY - startY) * (i / tailLength)*0.1}px;
          opacity: ${1 - i / tailLength};
        `;
        document.body.appendChild(particle);
        
        gsap.to(particle, {
          opacity: 0,
          duration: duration * 0.8,
          onComplete: () => particle.remove()
        });
      }, i * duration * 10);
    }
    
    this.lastMeteorTime = now;
    setTimeout(
      () => this.createMeteor(), 
      this.minInterval + Math.random() * (this.maxInterval - this.minInterval)
    );
  }
};


// =========== 星空管理器 ===========
const StarsManager = {
  stars: [],
  messageCount: 0,
  lastMessageTime: Date.now(),
  frequency: 0, // 消息频率(每分钟)

  sizeClasses: ['small', 'medium', 'large'],

  init() {
    this.createInitialStars(100);
    setInterval(() => this.updateFrequency(), 60000); // 每分钟更新一次频率
  },
  
  createInitialStars(count) {
    for (let i = 0; i < count; i++) {
      this.createStar(true); // 初始创建透明度较低的星星
    }
  },
  
  // 修改 StarsManager 中的 createStar 方法
  createStar(isInitial = false) {
    const star = document.createElement('div');
    star.className = `star ${this.sizeClasses[Math.floor(Math.random() * this.sizeClasses.length)]}`;
    
    // 初始透明度降低但保留动画能力
    star.style.opacity = isInitial ? 0.3 : 0.6;
    
    // 保留位置随机性
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;

    // 移除 GSAP 的 opacity 动画（保留其他效果）
    gsap.to(star, {
      rotation: Math.random() * 360,
      duration: 10 + Math.random() * 20,
      repeat: -1,
      yoyo: true
    });

    document.body.appendChild(star);
    this.stars.push(star);
    //return star
  },

  updateStarsBrightness() {
    // 根据消息频率调整星星亮度 (0.2到1.0之间)
    const targetOpacity = Math.min(1, 0.2 + this.frequency / 15);
    
    this.stars.forEach(star => {
      // 使用计算出的targetOpacity而不是未定义的baseOpacity
      star.style.opacity = targetOpacity;
      // 添加闪烁动画
      gsap.to(star, {
        opacity: targetOpacity * 0.7,
        duration: 2 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
    
    // 消息频率高时添加更多星星
     // 高频时添加新星星的阈值调整为15
    if (this.frequency > 15 && this.stars.length < 200) {
      setTimeout(() => this.createStar(), 300);
    }
  },
  
  recordMessage() {
    const now = Date.now();
    this.messageCount++;
    
    // 每分钟衰减频率
    const minutesPassed = (now - this.lastMessageTime) / 60000;
    this.frequency = this.frequency * Math.pow(0.5, minutesPassed) + 1;
    this.lastMessageTime = now;
    
    this.updateStarsBrightness();
  },
  
  updateFrequency() {
    // 每分钟衰减频率
    this.frequency *= 0.7;
    this.updateStarsBrightness();
  }
};


// =========== 历史记录管理 ===========
const history = {
  // 从本地存储加载
  load() {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        state.currentRole = data.currentRole || state.currentRole;
        if (data.messages?.length > 0) {
          DOM.chatContainer.innerHTML = '';
          data.messages.forEach(msg => {
            this.addMessage(msg.text, msg.type, true); // 静默添加
          });
        }
      } catch (e) {
        console.error('加载历史记录失败:', e);
      }
    }
  },

  // 保存到本地存储
  save() {
    const messages = Array.from(DOM.chatContainer.querySelectorAll('.message'))
      .map(el => ({
        text: el.textContent,
        type: el.classList.contains('user-message') ? 'user-message' : 
              el.classList.contains('bot-message') ? 'bot-message' : 'system-message'
      }));
    
    localStorage.setItem('chatHistory', JSON.stringify({
      currentRole: state.currentRole,
      messages
    }));
  },

  // 静默添加消息（不触发保存）
  addMessage(text, type, silent = false) {
    if (type === 'system-message' && silent) return; // 系统消息不入历史
    
    const el = document.createElement('div');
    el.className = `message ${type}`;
    el.textContent = text;
    DOM.chatContainer.appendChild(el);
    if (!silent) this.save(); // 自动保存
  }
};

// =========== 状态管理 ===========
const state = {
  isMusicPlaying: false,
  audioPlayer: new Audio(),
  isListening: false,
  recognition: null,
  totalMessages: 0,
  fireflies: [],
  maxFireflies: 50,
  fireflyLifespans: new Map(),
  currentRole: 'yingrou',
  roles: {
    yingrou: { 
      name: '荧柔', 
      promptPath: 'roles/yingrou.md', 
      avatar: 'roles/avatars/yingrou.png', 
      color: '#FF7D00' 
    },
    xueya: { 
      name: '雪雅', 
      promptPath: 'roles/xueya.md', 
      avatar: 'roles/avatars/xueya.png', 
      color: '#00B4D8' 
    }
  }
};

// =========== DOM 元素缓存 ===========
const DOM = {
  get inputContainer() { 
    return document.querySelector('.input-container') || document.createElement('div') 
  },
  get currentRoleName() { 
    return document.getElementById('currentRoleName') || document.createElement('span') 
  },
  get chatContainer() { return document.getElementById('chatContainer') || document.createElement('div') },
  get messageInput() { return document.getElementById('messageInput') || document.createElement('input') },
  get sendBtn() { return document.getElementById('sendBtn') || document.createElement('button') },
  get voiceBtn() { return document.getElementById('voiceBtn') || document.getElementById('micBtn') || document.createElement('button') },
  get forgetBtn() { return document.getElementById('forgetBtn') || document.createElement('button') },
  get roleToggleBtn() { return document.getElementById('roleToggleBtn') || document.createElement('button') },
  get currentRoleAvatar() { return document.getElementById('currentRoleAvatar') || document.createElement('img') },
  get roleList() { return document.getElementById('roleList') || document.createElement('div') },
  get roleDropdown() { return document.querySelector('.role-dropdown') || document.createElement('div') }
};
// ====== 新增萤火虫管理器 ======
const FireflyManager = {
  // 配置参数
  config: {
    userColor: '#ADD8E6', // 用户消息的淡蓝色
    botColor: '#FFFACD', // AI回复的淡黄色
    baseCount: 3,        // 基础萤火虫数量
    maxCount: 50,        // 最大萤火虫数量
    minLifespan: 2000,   // 最小生命周期(ms)
    maxLifespan: 4000    // 最大生命周期(ms)
  },
  
  // 状态跟踪
  state: {
    activeCount: 0,         // 当前活跃萤火虫数
    lastMessageTime: 0,     // 最后消息时间戳
    messageFrequency: 0,    // 消息频率(最近1分钟内)
    timers: new Map()       // 存储清理定时器
  },
  
  // 初始化
  init() {
    setInterval(() => this.updateFrequency(), 60000); // 每分钟更新频率
  },
  
  // 更新消息频率
  updateFrequency() {
    const now = Date.now();
    // 衰减计算: 每分钟频率减半
    this.state.messageFrequency = Math.max(0, this.state.messageFrequency * 0.5);
    this.state.lastMessageTime = now;
  },
  
  // 动态计算当前应生成的萤火虫数量
  getDynamicCount() {
    const { baseCount, maxCount } = this.config;
    const { messageFrequency } = this.state;
    
    // 基于消息频率计算额外数量 (最高增加7个)
    const extra = Math.min(7, Math.floor(messageFrequency / 5));
    return Math.min(maxCount - this.state.activeCount, baseCount + extra);
  },
  
  // 创建萤火虫群
  createFireflies(messageType, messageElement) {
    const now = Date.now();
    this.state.lastMessageTime = now;
    this.state.messageFrequency += 1;
    
    const color = messageType === 'bot-message' 
      ? this.config.botColor 
      : this.config.userColor;
    
    const count = this.getDynamicCount();
    const rect = messageElement.getBoundingClientRect();
    
    for (let i = 0; i < count; i++) {
      // 延迟创建以分散效果
      setTimeout(() => this.createFirefly(color, rect), i * 300);
    }
  },
  
  // 创建单个萤火虫
  createFirefly(color, sourceRect) {
    if (this.state.activeCount >= this.config.maxCount) return;
    
    const firefly = document.createElement('div');
    firefly.className = 'firefly dynamic-firefly';
    
    // 随机属性
    const size = Math.random() * 4 + 2;
    const lifespan = this.config.minLifespan + 
                     Math.random() * (this.config.maxLifespan - this.config.minLifespan);
    
    // 初始位置 (从消息元素附近开始)
    const startX = sourceRect.left + (sourceRect.width * Math.random());
    const startY = sourceRect.top + (sourceRect.height * Math.random());
    
    // 设置样式
    firefly.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      left: ${startX}px;
      top: ${startY}px;
      opacity: 0;
      filter: blur(1px);
    `;
    
    document.body.appendChild(firefly);
    this.state.activeCount++;
    
    // 淡入动画
    gsap.to(firefly, {
      opacity: 0.8,
      duration: 0.5,
      onComplete: () => this.animateFirefly(firefly)
    });
    
    // 设置生命周期定时器
    const timer = setTimeout(() => {
      this.removeFirefly(firefly);
    }, lifespan);
    
    this.state.timers.set(firefly, timer);
  },
  
  // 萤火虫漂浮动画
  animateFirefly(element) {
    if (!element || !element.isConnected) return;
    
    const moveX = (Math.random() - 0.5) * 100;
    const moveY = (Math.random() - 0.5) * 100;
    
    gsap.to(element, {
      x: `+=${moveX}`,
      y: `+=${moveY}`,
      duration: 3 + Math.random() * 4,
      ease: "sine.inOut",
      onComplete: () => this.animateFirefly(element)
    });
  },
  
  // 移除萤火虫(带淡出效果)
  removeFirefly(element) {
    if (!element || !element.isConnected) return;
    
    gsap.to(element, {
      opacity: 0,
      duration: 0.8,
      onComplete: () => {
        element.remove();
        this.state.activeCount--;
        this.state.timers.delete(element);
      }
    });
  },
  
  // 清理所有萤火虫
  clearAll() {
    document.querySelectorAll('.dynamic-firefly').forEach(el => {
      clearTimeout(this.state.timers.get(el));
      el.remove();
    });
    this.state.activeCount = 0;
    this.state.timers.clear();
  }
};

// =========== 核心功能 ===========
const app = {

  // 初始化所有功能
  async init() {
    StarsManager.init();
    this.initEventListeners();
    this.initVisualEffects();
    await this.loadAllRoles();
    this.showInitialPrompt(); 
    
    // 自动播放背景音乐处理
    document.body.addEventListener('click', this.playBackgroundMusic, { once: true });
  },

  // 事件监听初始化
  initEventListeners() {
    // 消息发送
    DOM.sendBtn.addEventListener('click', this.sendMessage.bind(this));
    DOM.messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // 语音输入
    DOM.voiceBtn.addEventListener('click', this.toggleVoiceRecognition.bind(this));

    // 清空聊天
    DOM.forgetBtn.addEventListener('click', () => {
      if (confirm('确定要清空所有聊天记录吗？')) {
        this.clearChatHistory();
      }
    });

    // 角色选择器
    this.initRoleSelector();
  },

  // 加载所有角色数据
  async loadAllRoles() {
    try {
      // 先加载默认角色作为备份
      const defaultRoles = {
        yingrou: { 
          name: '荧柔', 
          promptPath: 'roles/yingrou.md', 
          avatar: 'roles/avatars/yingrou.png', 
          color: '#FF7D00' 
        },
        xueya: { 
          name: '雪雅', 
          promptPath: 'roles/xueya.md', 
          avatar: 'roles/avatars/xueya.png', 
          color: '#00B4D8' 
        }
      };

      // 尝试从服务器加载
      const response = await fetch('roles/list.json');
      if(response.ok) {
        const rolesData = await response.json();
        // 合并时默认角色作为备选
        state.roles = { 
          ...rolesData,  // 优先使用服务器数据
          ...defaultRoles // 只保留服务器没有的角色
        };
      } else {
        state.roles = defaultRoles;
      }
      
      this.renderRoleList();
    } catch (error) {
      console.error('加载角色列表失败，使用默认角色:', error);
      // 设置默认角色
      state.roles = {
        yingrou: { /* 荧柔配置 */ },
        xueya: { /* 雪雅配置 */ }
      };
      this.renderRoleList();
    }
  },


  // 渲染角色列表
  renderRoleList() {
    DOM.roleList.innerHTML = '';
    // 使用Set记录已显示的角色名
    const displayedNames = new Set();
    
    Object.entries(state.roles).forEach(([roleId, roleInfo]) => {
      // 跳过重复名称的角色
      if(displayedNames.has(roleInfo.name)) return;
      displayedNames.add(roleInfo.name);
      
      const roleElement = document.createElement('div');
      roleElement.className = 'role-option';
      roleElement.dataset.roleId = roleId;
      roleElement.innerHTML = `
        <img src="${roleInfo.avatar}" alt="${roleInfo.name}" class="role-avatar" 
            onerror="this.src='data:image/svg+xml;base64,...'">
        <span class="role-name">${roleInfo.name}</span>
      `;
      DOM.roleList.appendChild(roleElement);
    });

    // 角色搜索功能
    const searchInput = document.querySelector('.role-search input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.role-option').forEach(option => {
          option.style.display = option.textContent.toLowerCase().includes(searchTerm) ? 'flex' : 'none';
        });
      });
    }
  },

  // 初始化角色选择器
  initRoleSelector() {
    // 切换下拉菜单
    DOM.roleToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      DOM.roleDropdown.classList.toggle('show');
    });

    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', (e) => {
      if (!DOM.roleDropdown.contains(e.target) && !DOM.roleToggleBtn.contains(e.target)) {
        DOM.roleDropdown.classList.remove('show');
      }
    });

    // 角色选择
    DOM.roleList.addEventListener('click', (e) => {
      const roleOption = e.target.closest('.role-option');
      if (roleOption) {
        this.changeRole(roleOption.dataset.roleId);
      }
    });
  },

  // 切换角色
  changeRole(roleId) {
    const role = state.roles[roleId];
    if (!role) return;

    // GSAP动画确保同步更新
    gsap.to([DOM.currentRoleAvatar, DOM.roleToggleBtn], {
      scale: 0.8,
      opacity: 0.5,
      duration: 0.15,
      onComplete: () => {
        // 重点：同步更新头像和名称
        DOM.currentRoleAvatar.src = role.avatar;
        DOM.currentRoleAvatar.alt = role.name;
        DOM.currentRoleName.textContent = role.name;
        
        state.currentRole = roleId;
        
        // 确保颜色过渡动画
        gsap.to(DOM.roleToggleBtn, {
          backgroundColor: role.color + '33', // 带透明度
          duration: 0.3
        });
      }
    }
    );

    gsap.to([DOM.currentRoleAvatar, DOM.roleToggleBtn], {
      scale: 1,
      opacity: 1,
      duration: 0.2,
      delay: 0.15
    });
    this.addSystemMessage(`已切换角色: ${role.name}`);
    // 关闭下拉菜单
    DOM.roleDropdown.classList.remove('show');
  },

  // 发送消息
  async sendMessage() {
    const message = DOM.messageInput.value.trim();
    if (!message) return;
    
    // 用户消息
    this.addMessage(message, 'user-message');
    DOM.messageInput.value = '';
  
    // 立即创建萤火虫（用户发送时）
    this.createFireflies(3, state.roles[state.currentRole].color); // ✨ 新增

    // 显示"思考中"状态
    const loadingMsg = this.createLoadingMessage();
    DOM.chatContainer.appendChild(loadingMsg);
    DOM.chatContainer.scrollTop = DOM.chatContainer.scrollHeight;

    try {
      // 获取AI响应
      const response = await this.getAIResponse(message, state.currentRole);
      
      // 显示响应
      loadingMsg.remove();
      this.addMessage(response, 'bot-message');
      setTimeout(scrollToBottom, 50);
      
      // 添加特效
      this.createFireflies(3, state.roles[state.currentRole].color);
    } catch (error) {
      console.error('发送消息失败:', error);
      loadingMsg.remove();
      this.addMessage('回复生成失败，请稍后再试', 'bot-message');
    }
  },

  // 获取AI响应
  async getAIResponse(message, roleId) {
    const currentRole = state.roles[roleId];
    let rolePrompt = '';
    
    // 加载角色提示词
    try {
      if (currentRole.promptPath) {
        const response = await fetch(currentRole.promptPath);
        if (response.ok) rolePrompt = await response.text();
      }
    } catch (err) {
      console.error('加载角色提示失败:', err);
    }

    // 实际API请求
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sk-bdtmxzzsokfgufqlxrzjdvfbtwccfreafooqiefglkirsdtp',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3",
        messages: [
          { role: "system", content: rolePrompt || currentRole.name },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 512
      })
    });

    if (!response.ok) throw new Error(`API请求失败: ${response.status}`);
    
    const data = await response.json();
    return data?.choices?.[0]?.message?.content || '我无法回应这个问题...';
  },

  // 语音识别功能
  toggleVoiceRecognition() {
    if (!state.recognition) {
      this.initSpeechRecognition();
    }

    if (state.isListening) {
      state.recognition.stop();
      DOM.voiceBtn.classList.remove('active');
      state.isListening = false;
    } else {
      state.recognition.start();
      DOM.voiceBtn.classList.add('active');
      state.isListening = true;
    }
  },

  // 初始化语音识别
  initSpeechRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      DOM.messageInput.value = transcript;
      DOM.voiceBtn.classList.remove('active');
      state.isListening = false;
    };

    recognition.onerror = (e) => {
      console.error('语音识别错误:', e.error);
      DOM.voiceBtn.classList.remove('active');
      state.isListening = false;
    };

    state.recognition = recognition;
  },

  // 清空聊天记录
  clearChatHistory() {
    //this.addSystemMessage('聊天记录已清空');
    DOM.chatContainer.innerHTML = '';
    state.totalMessages = 0;
    
  },

  // =========== UI 相关方法 ===========
  addMessage(text, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = text;
    DOM.chatContainer.appendChild(messageElement);
    DOM.chatContainer.scrollTop = DOM.chatContainer.scrollHeight;
    state.totalMessages++;
  },

  addSystemMessage(text) {
    this.addMessage(text, 'system-message');
  },

  createLoadingMessage() {
    const element = document.createElement('div');
    element.className = 'message bot-message loading';
    element.innerHTML = `
      <div class="loading-dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    `;
    return element;
  },

  // =========== 视觉效果 ===========
  initVisualEffects() {
    // 初始萤火虫
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.createFirefly(), i * 500);
    }
    
    // 鼠标轨迹
    this.initCursorTrail();
    
    // 点击特效
    document.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') return;
      this.createRippleEffect(e);
    });
  },

  createFireflies(count = 1, color = 'white') {
    for (let i = 0; i < count; i++) {
      if (state.fireflies.length >= state.maxFireflies) return;
      
      const firefly = document.createElement('div');
      firefly.className = 'firefly';
      firefly.style.backgroundColor = color;
      
      // 随机位置和大小
      const size = Math.random() * 4 + 2;
      firefly.style.width = `${size}px`;
      firefly.style.height = `${size}px`;
      firefly.style.left = `${Math.random() * 100}%`;
      firefly.style.top = `${Math.random() * 100}%`;
      
      // 动画参数
      const duration = 15 + Math.random() * 15;
      const delay = Math.random() * -20;
      firefly.style.animation = `firefly-pulse ${duration}s ${delay}s infinite`;
      
      document.body.appendChild(firefly);
      state.fireflies.push(firefly);
      state.fireflyLifespans.set(firefly, Date.now() + 30000); // 30秒生命周期
      
      // 移动动画
      this.animateFirefly(firefly);
    }
  },

  animateFirefly(element) {
    if (!element || !element.parentNode) return;
    
    const moveX = Math.random() * 200 - 100;
    const moveY = Math.random() * 200 - 100;
    
    gsap.to(element, {
      x: `${moveX}px`,
      y: `${moveY}px`,
      duration: 10 + Math.random() * 15,
      ease: "sine.inOut",
      onComplete: () => this.animateFirefly(element)
    });
  },

  initCursorTrail() {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    
    document.addEventListener('mousemove', (e) => {
      gsap.to(trail, {
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        opacity: 1,
        duration: 0.1,
        ease: "power1.out"
      });
      
      setTimeout(() => {
        gsap.to(trail, {
          opacity: 0,
          duration: 0.5
        });
      }, 100);
    });
  },

  createRippleEffect(e) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    
    gsap.to(ripple, {
      scale: 20,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      onComplete: () => ripple.remove()
    });
  },

  // =========== 音乐控制 ===========
  playBackgroundMusic() {
    if (state.isMusicPlaying) return;
    
    state.audioPlayer.src = 'assets/bgm.mp3';
    state.audioPlayer.loop = true;
    state.audioPlayer.volume = 0.3;
    
    // 处理自动播放策略
    const playPromise = state.audioPlayer.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('自动播放被阻止:', error);
        // 显示音乐播放按钮让用户手动触发
        this.showMusicPlayButton();
      });
    }
    
    state.isMusicPlaying = true;
  },

  showMusicPlayButton() {
    const musicBtn = document.createElement('button');
    musicBtn.id = 'musicToggleBtn';
    musicBtn.textContent = '播放背景音乐';
    document.body.appendChild(musicBtn);
    
    musicBtn.addEventListener('click', () => {
      state.audioPlayer.play();
      musicBtn.remove();
    });
  },

  // =========== 欢迎信息 ===========
  addWelcomeMessage() {
    const welcomeMessages = [
      `欢迎使用AI角色聊天！当前角色: ${state.roles[state.currentRole].name}`,
      
    ];
    
    welcomeMessages.forEach((msg, i) => {
      setTimeout(() => {
        this.addSystemMessage(msg);
      }, i * 800);
    });
  }
};


// ====== 修改消息发送逻辑 ======
app.sendMessage = async function() {
  
  const message = DOM.messageInput.value.trim();
  if (!message) return;
  
  // 记录消息(影响星星亮度)
  StarsManager.recordMessage();
  
  // 用户消息
  const userMsgElement = this.createMessageElement(message, 'user-message');
  DOM.chatContainer.appendChild(userMsgElement);
  DOM.messageInput.value = '';
  
  // 触发用户萤火虫
  FireflyManager.createFireflies('user-message', userMsgElement);

  // 显示"思考中"状态
  const loadingMsg = this.createLoadingMessage();
  DOM.chatContainer.appendChild(loadingMsg);
  DOM.chatContainer.scrollTop = DOM.chatContainer.scrollHeight;
  
  try {
    const response = await this.getAIResponse(message, state.currentRole);
    loadingMsg.remove();
    
    const botMsg = this.createMessageElement(response, 'bot-message');
    DOM.chatContainer.appendChild(botMsg);
    FireflyManager.createFireflies('bot-message', botMsg);
    
    // 自动保存历史记录（不包含系统消息）
    history.save();
  } catch (error) {
    // 错误处理...
  }
};

// ====== 修改消息元素创建 ======
app.createMessageElement = function(text, type) {
  const element = document.createElement('div');
  element.className = `message ${type}`;
  element.textContent = text;
  return element;
};
// 新增初始引导方法
app.showInitialPrompt = async function() {
  const role = state.roles[state.currentRole];
  
  // 显示系统引导消息（不入历史记录）
  this.addMessage(
    `欢迎与${role.name}聊天！今天想聊些什么呢？`, 
    'system-message', 
    true
  );
  
  // AI主动发送第一条消息
  try {
    const response = await this.getAIResponse(
      "请用一句话主动向用户打招呼并开启对话", 
      state.currentRole
    );
    
    this.addMessage(response, 'bot-message');
    FireflyManager.createFireflies('bot-message', 
      DOM.chatContainer.lastElementChild
    );
  } catch (error) {
    console.error('初始引导失败:', error);
  }
};

// =========== 音乐控制 ===========
app.toggleMusic = function() {
  const musicBtn = document.getElementById('musicToggleBtn');
  
  if (state.isMusicPlaying) {
    state.audioPlayer.pause();
    musicBtn.innerHTML = '🎵 播放音乐';
    musicBtn.classList.remove('music-playing');
  } else {
    state.audioPlayer.play()
      .then(() => {
        musicBtn.innerHTML = '❌ 关闭音乐';
        musicBtn.classList.add('music-playing');
      })
      .catch(error => {
        console.log('播放失败:', error);
        musicBtn.innerHTML = '⛔ 播放失败';
      });
  }
  
  state.isMusicPlaying = !state.isMusicPlaying;
};
app.addMusicControlButton = function() {
  const musicBtn = document.createElement('button');
  musicBtn.id = 'musicToggleBtn';
  musicBtn.className = 'music-control';
  musicBtn.innerHTML = state.isMusicPlaying ? '❌ 关闭音乐' : '🎵 播放音乐';
  
  if (state.isMusicPlaying) {
    musicBtn.classList.add('music-playing');
  }
  musicBtn.addEventListener('click', () => this.toggleMusic());
  DOM.inputContainer.insertBefore(musicBtn, DOM.inputContainer.firstChild);
};

// ====== 修改音乐播放错误处理 ======
app.playBackgroundMusic = function() {
  if (state.isMusicPlaying) return;
  state.audioPlayer.src = 'backmusic/1.mp3';
  state.audioPlayer.loop = true;
  state.audioPlayer.volume = 0.3;
  
  const playPromise = state.audioPlayer.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        state.isMusicPlaying = true;
        const musicBtn = document.getElementById('musicToggleBtn');
        if (musicBtn) {
          musicBtn.innerHTML = '❌ 关闭音乐';
          musicBtn.classList.add('music-playing');
        }
      })
      .catch(error => {
        console.log('自动播放被阻止:', error);
        this.addMusicControlButton();
      });
  }
  //state.isMusicPlaying = true;
};

// ====== 修复初始萤火虫创建 ======
app.initVisualEffects = function() {
  // 初始萤火虫 - 使用新系统
  FireflyManager.createFireflies('bot-message', {
    getBoundingClientRect: () => ({
      left: window.innerWidth / 2,
      top: window.innerHeight / 2,
      width: 10,
      height: 10
    })
  });
  
  // 鼠标轨迹
  this.initCursorTrail();
  
  // 点击特效
  document.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    this.createRippleEffect(e);
  });
};

// 修改原有方法
app.addMessage = history.addMessage.bind(history);

// 发送消息时自动滚动到底部
function scrollToBottom() {
  const container = document.getElementById('chatContainer');
  container.scrollTop = container.scrollHeight;
}
app.clearChatHistory = () => {
  DOM.chatContainer.innerHTML = '';
  state.totalMessages = 0;
  history.save(); // 清空时也更新存储
  //history.addMessage('聊天记录已清空', 'system-message');
};

// 添加音乐控制按钮
app.addMusicControlButton = function() {
  if (document.getElementById('musicToggleBtn')) return;
  
  const musicBtn = document.createElement('button');
  musicBtn.id = 'musicToggleBtn';
  musicBtn.className = 'music-control';
  musicBtn.innerHTML = state.isMusicPlaying ? '❌ 关闭音乐' : '🎵 播放音乐';
  
  if (state.isMusicPlaying) {
    musicBtn.classList.add('music-playing');
  }
  musicBtn.addEventListener('click', () => this.toggleMusic());
  
  // 确保只添加一次
  const container = document.querySelector('.input-container');
  if (container && !container.querySelector('#musicToggleBtn')) {
    container.insertBefore(musicBtn, container.firstChild);
  }
};

// 修改初始化部分
app.init = async function() {
  // 初始化星空管理器
  StarsManager.init();
  MeteorManager.init();
  
  this.initEventListeners();
  await this.loadAllRoles();
  this.addWelcomeMessage();
  
  try {
    // 启动视觉特效
    this.initVisualEffects();
    
    // 尝试预加载音乐但不自动播放
    state.audioPlayer.src = 'backmusic/1.mp3';
    state.audioPlayer.load();
    this.addMusicControlButton(); // 始终添加音乐按钮
    
    // 自动播放处理
    document.body.addEventListener('click', () => {
      if (!state.isMusicPlaying) {
        this.playBackgroundMusic();
      }
    }, { once: true });
  } catch (error) {
    console.error('初始化错误:', error);
  }
};

// 启动应用
// 修改启动代码
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 确保所有DOM元素已经加载
    await new Promise(resolve => {
      const check = () => {
        if (document.getElementById('chatContainer') && 
            document.querySelector('.input-container')) {
          resolve();
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
    
    // 初始化所有管理器
    FireflyManager.init();
    StarsManager.init();
    MeteorManager.init();
    
    // 启动应用
    await app.init();
    history.load();
    
    console.log('应用初始化完成');
  } catch (error) {
    console.error('初始化失败:', error);
  }
});

window.addEventListener('resize', () => {
  setTimeout(() => {
    const container = document.querySelector('.message-container');
    container.style.maxHeight = `${window.innerHeight - 200}px`;
  }, 100); // 100ms 防抖
});

delete app.createFireflies;
delete app.animateFirefly;