// 初始化WebSocket连接
const socket = new WebSocket('wss://api.deepseek.com');

// 获取DOM元素
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// 消息处理函数
function handleMessage(message) {
    // 创建消息元素
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    
    // 添加到聊天容器
    chatContainer.appendChild(messageElement);
}

// 发送消息到API
function sendMessage() {
    const message = userInput.value;
    if (message.trim() === '') return;
    
    // 发送消息到WebSocket
    socket.send(JSON.stringify({
        content: message,
        type: 'text'
    }));
    
    // 清空输入框
    userInput.value = '';
}

// 事件监听
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// WebSocket事件处理
socket.addEventListener('open', () => {
    console.log('WebSocket连接已建立');
});

socket.addEventListener('message', (event) => {
    handleMessage(event.data);
});

socket.addEventListener('error', (error) => {
    console.error('WebSocket错误:', error);
});