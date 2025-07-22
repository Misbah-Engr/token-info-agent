document.addEventListener('DOMContentLoaded', () => {
    const agent = new TokenInfoAgent();
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const exampleBtns = document.querySelectorAll('.example-btn');

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'agent'}`;
        messageDiv.innerHTML = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function processUserQuery(query) {
        if (!query.trim()) return;

        // Add user message
        addMessage(`<strong>You:</strong> ${query}`, true);
        
        // Show loading
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message agent loading';
        loadingDiv.innerHTML = '<em>🤖 Agent is fetching data...</em>';
        chatMessages.appendChild(loadingDiv);

        try {
            const response = await agent.processQuery(query);
            chatMessages.removeChild(loadingDiv);
            addMessage(`<strong>Agent:</strong><br>${agent.formatResponse(response)}`);
        } catch (error) {
            chatMessages.removeChild(loadingDiv);
            addMessage('<strong>Agent:</strong> Sorry, I encountered an error. Please try again.');
        }
    }

    // Event listeners
    sendBtn.addEventListener('click', () => {
        const query = userInput.value;
        processUserQuery(query);
        userInput.value = '';
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    exampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            userInput.value = btn.textContent;
            sendBtn.click();
        });
    });

    // Welcome message
    setTimeout(() => {
        addMessage('<strong>Agent:</strong> Hello! I can help you check token prices. Try asking about any cryptocurrency!');
    }, 500);
});
