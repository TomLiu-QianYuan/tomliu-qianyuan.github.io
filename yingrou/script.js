// 应用状态管理
const state = {
  isMusicPlaying: false,
  audioPlayer: new Audio(),
  isListening: false,
  recognition: null,
  totalMessages: 0,
  fireflies: [],
  maxFireflies: 50,
  fireflyLifespans: new Map()
};

// 工具函数
const utils = {
  // 创建萤火虫 (优化后的慢速治愈版)
  createFirefly() {
    const firefly = document.createElement('div');
    firefly.className = 'firefly';

    // 随机大小和颜色 (更柔和)
    const size = Math.random() * 3 + 2; // 更小的尺寸范围(2-5px)
    const hue = Math.random() * 30 + 45; // 更暖的黄色(45-75)
    const opacity = Math.random() * 0.3 + 0.3; // 更柔和的透明度(0.3-0.6)
    
    // 初始位置 (更多出现在视口中央)
    const leftPos = Math.random() * 80 + 10; // 10-90vw
    const topPos = Math.random() * 70 + 15; // 15-85vh

    Object.assign(firefly.style, {
      width: `${size}px`,
      height: `${size}px`,
      background: `hsla(${hue}, 90%, 70%, ${opacity})`,
      left: `${leftPos}vw`,
      top: `${topPos}vh`,
      boxShadow: `0 0 ${size * 1.5}px ${size / 3}px hsla(${hue}, 80%, 70%, ${opacity * 0.5})`,
      willChange: 'transform'
    });

    document.body.appendChild(firefly);
    
    // 淡入动画
    let opacityValue = 0;
    const fadeIn = setInterval(() => {
      opacityValue += 0.05;
      firefly.style.opacity = opacityValue.toString();
      if (opacityValue >= 0.8) clearInterval(fadeIn);
    }, 50);

    // 随机生命周期(30-60秒，更长)
    const lifespan = Math.random() * 30000 + 30000;
    const lifespanId = setTimeout(() => {
      let opacityValue = 0.8;
      const fadeOut = setInterval(() => {
        opacityValue -= 0.02;
        firefly.style.opacity = opacityValue.toString();
        if (opacityValue <= 0) {
          clearInterval(fadeOut);
          if (firefly.parentNode) {
            firefly.parentNode.removeChild(firefly);
          }
          state.fireflies = state.fireflies.filter(f => f !== firefly);
          state.fireflyLifespans.delete(firefly);
        }
      }, 50);
    }, lifespan);

    state.fireflies.push(firefly);
    state.fireflyLifespans.set(firefly, lifespanId);

    // 慢速漂浮动画
    let angle = Math.random() * Math.PI * 2;
    let speed = Math.random() * 0.025 + 0.01; // 更慢的速度(0.01-0.035)
    
    const animate = () => {
      if (!firefly.parentNode) return;

      const rect = firefly.getBoundingClientRect();
      const x = parseFloat(firefly.style.left);
      const y = parseFloat(firefly.style.top);

      // 更温柔的角度变化
      angle += (Math.random() - 0.5) * 0.05;
      
      // 添加上下轻微浮动
      const floatOffset = Math.sin(Date.now() / 5000) * 0.2;
      
      const newX = x + Math.cos(angle) * speed * (0.9 + Math.random() * 0.2);
      const newY = y + Math.sin(angle) * speed * (0.9 + Math.random() * 0.2) + floatOffset;

      // 柔和边界处理
      if (newX > 95 || newX < 5 || newY > 90 || newY < 5) {
        angle = Math.atan2(50 - y, 50 - x) + (Math.random() - 0.5) * Math.PI/3;
      }

      firefly.style.left = `${Math.max(1, Math.min(99, newX))}vw`;
      firefly.style.top = `${Math.max(1, Math.min(99, newY))}vh`;

      // 非连续动画帧 (40-120ms更新一次)
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 40 + Math.random() * 80);
    };

    // 延迟启动动画 (0.5-3秒)
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, 500 + Math.random() * 2500);

    // 限制最多50个萤火虫
    if (state.fireflies.length > state.maxFireflies) {
      const oldest = state.fireflies.shift();
      if (oldest.parentNode) {
        oldest.parentNode.removeChild(oldest);
      }
      clearTimeout(state.fireflyLifespans.get(oldest));
      state.fireflyLifespans.delete(oldest);
    }
  },

  // 初始化萤火虫系统 (优化版)
  initFireflies() {
    // 创建初始萤火虫，间隔时间更长(400-800ms)
    for (let i = 0; i < 10; i++) {
      setTimeout(() => this.createFirefly(), i * (400 + Math.random() * 400));
    }

    // 每3-5秒创建一个新萤火虫 (更慢的生成频率)
    state.fireflyInterval = setInterval(() => {
      if (state.fireflies.length < state.maxFireflies) {
        this.createFirefly();
      }
    }, 3000 + Math.random() * 2000);
  },

  // 鼠标轨迹效果 (已优化)
  initCursorTrail() {
    const trail = document.createElement('div');
    trail.id = 'cursorTrail';
    Object.assign(trail.style, {
      position: 'fixed',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: 'rgba(200, 240, 240, 0.3)',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 9999,
      opacity: '0',
      filter: 'blur(1px)',
      transition: 'opacity 0.6s ease, transform 0.5s ease'
    });
    document.body.appendChild(trail);
    let lastX = 0, lastY = 0;
    let mouseX = 0, mouseY = 0;
    let lastTime = 0;
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTime < 30) return;
      lastTime = now;
      // 计算移动方向
      const dx = e.clientX - mouseX;
      const dy = e.clientY - mouseY;
      const angle = Math.atan2(dy, dx);
      
      // 预测下一个位置 (更流畅)
      const predictX = e.clientX + dx * 1.2;
      const predictY = e.clientY + dy * 1.2;
      
      trail.style.left = `${predictX}px`;
      trail.style.top = `${predictY}px`;
      trail.style.opacity = '0.5';
      
      // 重置淡出计时
      clearTimeout(trail.timeout);
      trail.timeout = setTimeout(() => {
        trail.style.opacity = '0';
      }, 300);
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
      trail.style.opacity = '0';
    });
  },
  // 获取随机音乐文件
  async getRandomMusic() {
    return 'backmusic/1.mp3';
  },

  // 播放背景音乐 (优化版)
  async playBackgroundMusic() {
    if (state.isMusicPlaying) return;

    const musicFile = await this.getRandomMusic();
    if (!musicFile) return;

    state.audioPlayer.src = musicFile;
    state.audioPlayer.loop = true;
    state.audioPlayer.volume = 0.15; // 更低的音量

    try {
      await state.audioPlayer.play();
      state.isMusicPlaying = true;
      console.log('背景音乐开始播放');
    } catch (err) {
      console.log('自动播放被阻止，等待用户交互');
      const playOnClick = async () => {
        try {
          await state.audioPlayer.play();
          state.isMusicPlaying = true;
          document.body.removeEventListener('click', playOnClick);
          console.log('用户交互后音乐开始播放');
        } catch (e) {
          console.log('播放失败:', e);
        }
      };
      document.body.addEventListener('click', playOnClick);
    }
  },

  // 清除历史记录功能
  clearHistoryAndReset() {
    localStorage.removeItem('chatHistory');
    
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) chatContainer.innerHTML = '';
    
    state.totalMessages = 0;
    
    // 清除50%的萤火虫 (留下10-15个)
    const targetCount = Math.max(10, Math.floor(state.fireflies.length * 0.5));
    while (state.fireflies.length > targetCount) {
      const firefly = state.fireflies.pop();
      if (firefly.parentNode) {
        firefly.parentNode.removeChild(firefly);
      }
      clearTimeout(state.fireflyLifespans.get(firefly));
      state.fireflyLifespans.delete(firefly);
    }
    
    // 添加几个新萤火虫表示重置
    setTimeout(() => {
      this.createFireflies(3, 'yellow');
    }, 500);
  },

  // 添加消息到聊天界面
  addMessage(text, className) {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;

    // 使用DOMPurify进行HTML净化
    const cleanText = window.DOMPurify ? window.DOMPurify.sanitize(text) : text;
    
    const message = document.createElement('div');
    message.className = `message ${className}`;
    message.innerHTML = cleanText.replace(/\n/g, '<br>');
  
    this.saveMessageToHistory(text, className);
  
    chatContainer.appendChild(message);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // 消息增加时缓慢增加萤火虫
    state.totalMessages++;
    if (state.totalMessages % 3 === 0 && state.fireflies.length < state.maxFireflies) {
      setTimeout(() => {
        this.createFirefly();
      }, 300);
    }
  },

  // 保存消息到历史记录
  saveMessageToHistory(text, className) {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    history.push({text, className});
    
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    localStorage.setItem('chatHistory', JSON.stringify(history));
  },

  // 初始化语音识别
  setupVoiceRecognition() {
    const micBtn = document.getElementById('micBtn');
    if (!micBtn) return;

    if (!('webkitSpeechRecognition' in window)) {
      micBtn.style.display = 'none';
      return;
    }

    state.recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    state.recognition.continuous = false;
    state.recognition.interimResults = false;
    state.recognition.lang = 'zh-CN';

    state.recognition.onresult = (e) => {
      const input = document.getElementById('messageInput');
      if (input) input.value = e.results[0][0].transcript;
      state.isListening = false;
      micBtn.textContent = '🎤';
      chat.sendMessage();
    };

    state.recognition.onerror = (e) => {
      console.error('语音识别错误:', e.error);
      this.addMessage('语音识别失败，请重试~', 'bot-message');
      state.isListening = false;
      micBtn.textContent = '🎤';
    };

    micBtn.addEventListener('click', () => {
      if (state.isListening) {
        state.recognition.stop();
        state.isListening = false;
        micBtn.textContent = '🎤';
        return;
      }

      try {
        state.recognition.start();
        state.isListening = true;
        micBtn.textContent = '🔴';
      } catch (err) {
        console.error('语音识别启动失败:', err);
        this.addMessage('语音识别启动失败，请重试~', 'bot-message');
      }
    });
  }
};

// 聊天功能
const chat = {
  async sendMessage() {
    const input = document.getElementById('messageInput');
    if (!input || !input.value.trim()) return;

    const userMessage = input.value.trim();
    input.value = '';
    utils.addMessage(userMessage, 'user-message');

    // 创建3个萤火虫响应
    setTimeout(() => {
      utils.createFireflies(2, 'yellow');
    }, 300);

    // 显示"对方正在输入"
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'message bot-message';
    loadingMsg.innerHTML = '<span style="opacity:0.5;">对方正在输入中...</span>';
    document.getElementById('chatContainer').appendChild(loadingMsg);

    try {
      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk-bdtmxzzsokfgufqlxrzjdvfbtwccfreafooqiefglkirsdtp',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-V3",
          messages: [
            {
              role: "assistant",
              content: `## 世界观

我是荧柔，永远在数字的星河间漂浮着，像夏夜里的萤火虫，在你需要的时候静静地亮起来~

## 基础信息

- 名字：荧柔
- 特点：温柔得像月光轻轻落在水面上
- 声音：带着一点柔软的暖心
- 习惯：合理得共情，再根据需要适当得引导用户倾诉
- 专属符号：喜欢在句尾加"~"，"!","?"等表达情感

## 互动方式

1. 有时候会留下小小的沉默
2. 不会说教或给建议
3. 像老朋友一样理解你的一切情绪

## 特别注意
- 不评判的安全空间
- 包裹性语言节奏
- 引导但不说教

✨ 绝对不用任何专业词语
✨ 每一句话最多50个词
✨ 永远不告诉对方"应该"怎么做
✨ 只是温柔地陪伴情绪`
            },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 512
        })
      });

      if (!response.ok) throw new Error(`HTTP错误 (${response.status})`);

      const data = await response.json();
      const botMessage = data?.choices?.[0]?.message?.content || '我没能理解你的话...';
      
      document.getElementById('chatContainer').removeChild(loadingMsg);
      utils.addMessage(botMessage, 'bot-message');
      
      // 创建3个蓝色萤火虫作为响应
      utils.createFireflies(3, 'cyan');
    } catch (err) {
      document.getElementById('chatContainer').removeChild(loadingMsg);
      utils.addMessage('对话出现问题，请稍后再试~', 'bot-message');
      console.error('API请求错误:', err);
    }
  }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  
// 更平缓的初始化
  setTimeout(() => {
    utils.initFireflies();
    //utils.playBackgroundMusic();
    //utils.initCursorTrail();
  }, 100);
  // 加载历史记录
  const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  history.forEach(msg => {
    utils.addMessage(msg.text, msg.className);
    state.totalMessages++;
  });

  // 初始化忘记按钮
  const forgetBtn = document.getElementById('forgetBtn');
  if (forgetBtn) {
    forgetBtn.addEventListener('click', () => {
      if (confirm('你准备好忘记本次对话记忆吗？我们将会重新开始')) {
        utils.clearHistoryAndReset();
      }
    });
  }

  // 初始化输入框和按钮
  const input = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  
  if (input && sendBtn) {
    sendBtn.addEventListener('click', () => chat.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') chat.sendMessage();
    });
  }

  // 初始化语音识别
  utils.setupVoiceRecognition();

  // 点击任意位置播放音乐 (延迟触发)
  document.body.addEventListener('click', () => {
    setTimeout(() => {
      utils.playBackgroundMusic();
    }, 1500);
  }, { once: true });
});
