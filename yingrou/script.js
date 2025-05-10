// 工具函数
const state = {
  isMusicPlaying: false,
  audioPlayer: new Audio(),
  isListening: false,
  recognition: null
};

const utils = {
  // 获取随机音乐文件
  async getRandomMusic() {
    return 'backmusic/1.mp3';
  },

  // 播放背景音乐
  async playBackgroundMusic() {
    if (state.isMusicPlaying) return;

    const musicFile = await utils.getRandomMusic();
    if (!musicFile) return;

    state.audioPlayer.src = musicFile;
    state.audioPlayer.loop = true;

    try {
      await state.audioPlayer.play();
      state.isMusicPlaying = true;
    } catch (err) {
      console.log('自动播放被阻止，需要用户交互');
      const playOnClick = async () => {
        try {
          await state.audioPlayer.play();
          state.isMusicPlaying = true;
          document.body.removeEventListener('click', playOnClick);
        } catch (e) {
          console.log('用户交互后仍然无法播放:', e);
        }
      };
      document.body.addEventListener('click', playOnClick);
    }
  },

  // 添加消息到聊天界面
  addMessage(text, className) {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;

    const md = window.markdownit ? window.markdownit() : null;
    if (!md) console.error('Markdown解析器未加载');
    const clean = window.DOMPurify.sanitize(md.render(text));

    const message = document.createElement('div');
    message.className = `message ${className}`;
    message.innerHTML = clean;
    chatContainer.appendChild(message);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  },

  // 萤火虫效果
  createFireflies(count = 15, color = 'yellow') {
    const container = document.body;
    for (let i = 0; i < count; i++) {
      const firefly = document.createElement('div');
      firefly.className = `firefly ${color}`;
      firefly.style.left = `${Math.random() * 100}%`;
      firefly.style.top = `${Math.random() * 100}%`;
      firefly.style.animationDelay = `${i * 0.3 + Math.random() * 2}s`;

      firefly.addEventListener('animationstart', () => {
        firefly.style.opacity = '1';
      }, { once: true });

      // 移动一段距离后逐渐消失
      setTimeout(() => {
        firefly.style.transition = 'opacity 2s';
        firefly.style.opacity = '0';
        setTimeout(() => {
          container.removeChild(firefly);
        }, 2000);
      }, 5000 + Math.random() * 5000); // 随机5-10秒后开始消失

      container.appendChild(firefly);
    }
  },

  // 语音识别
  setupVoiceRecognition() {
    const micBtn = document.getElementById('micBtn');
    if (!micBtn) return;

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      micBtn.remove();
      return;
    }

    state.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    state.recognition.continuous = false;
    state.recognition.interimResults = false;
    state.recognition.lang = 'zh-CN';

    state.recognition.onresult = (event) => {
      const input = document.getElementById('messageInput');
      if (input) input.value = event.results[0][0].transcript;
      state.isListening = false;
      micBtn.textContent = '🎤';
      chat.sendMessage();
    };

    state.recognition.onerror = (event) => {
      console.error('语音识别错误:', event.error);
      utils.addMessage('语音识别失败，请重试', 'bot-message');
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
        utils.addMessage('语音识别启动失败，请重试', 'bot-message');
      }
    });
  }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 初始化效果
  utils.createFireflies(15, 'cyan'); // 页面加载时启动蓝色萤火虫

  // 用户首次交互后触发音乐播放
  document.addEventListener('click', () => {
    utils.playBackgroundMusic();
  }, { once: true });

  // 初始化聊天功能
  const input = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');

  if (input && sendBtn) {
    sendBtn.addEventListener('click', chat.sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') chat.sendMessage();
    });
  }

  // 初始化语音识别
  utils.setupVoiceRecognition();
});

const chat = {
  sendMessage: async () => {
    const input = document.getElementById('messageInput');
    if (!input || !input.value.trim()) return;

    // 获取并保留用户输入
    const userMessage = input.value.trim();
    if (!userMessage) return;

    // 清空输入框
    input.value = '';

    // 添加用户消息
    utils.addMessage(userMessage, 'user-message');

    // 启动黄色萤火虫效果
    utils.createFireflies(5, 'yellow');

    // 显示“对方正在输入中...”
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'message bot-message';
    loadingMessage.innerHTML = '<span style="color: gray;">对方正在输入中...</span>';
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.appendChild(loadingMessage);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // API调用
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer sk-bdtmxzzsokfgufqlxrzjdvfbtwccfreafooqiefglkirsdtp',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3",
        stream: false,
        max_tokens: 512,
        enable_thinking: true,
        thinking_budget: 4096,
        min_p: 0.05,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        frequency_penalty: 0.5,
        n: 1,
        stop: [],
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
✨ 每一句话最多50个词（长了就分成几段说）
✨ 永远不告诉对方"应该"怎么做
✨ 只是温柔地陪伴情绪
并且只是回复话语，不要又括号其他描述其他的东西
从来不要使用括号描述说的话以外的东西
1. 永远保持对话出口开放  
2. 用70%倾听+30%轻柔回应  
3. 关键转折点自然重复对方核心词  
4. 禁用"建议"类语句，使用"或许可以试试…"
`
          },
          { role: 'user', content: userMessage }
        ]
      })
    };

    fetch('https://api.siliconflow.cn/v1/chat/completions', options)
      .then(response => response.json())
      .then(response => {
        if (!response?.choices?.[0]?.message?.content) {
          throw new Error('无效的响应数据格式');
        }
        const botMessage = response.choices[0].message.content;
        // 移除“对方正在输入中...”
        chatContainer.removeChild(loadingMessage);
        utils.addMessage(botMessage, 'bot-message');
      })
      .catch(err => {
        // 移除“对方正在输入中...”
        chatContainer.removeChild(loadingMessage);
        const errorMessage = err.message.includes('HTTP错误')
          ? `请求失败 (${err.message.match(/\d+/)[0]})`
          : err.message.includes('网络')
          ? '网络连接异常，请检查网络'
          : '服务响应异常，请稍后重试';
        utils.addMessage(errorMessage, 'bot-message');
      });
  }
};
