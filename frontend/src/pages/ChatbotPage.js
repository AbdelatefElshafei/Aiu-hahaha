import React from 'react';
import SimpleChatbot from '../components/Chatbot/SimpleChatbot'; // Adjust path if needed

const ChatbotPage = () => {
    return (
        <div>
            <h2 style={{ textAlign: 'center', margin: '20px 0' }}>Chat with our Assistant</h2>
            <SimpleChatbot />
        </div>
    );
};

export default ChatbotPage;