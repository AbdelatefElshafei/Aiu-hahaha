import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToBot } from '../../api'; // Make sure the path is correct

const SimpleChatbot = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! How can I help you?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null); 

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!inputValue.trim()) return; 

        const userMessage = {
            id: Date.now(), 
            text: inputValue,
            sender: 'user'
        };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInputValue(''); 
        setIsLoading(true);

        try {
            const response = await sendMessageToBot({ message: userMessage.text });
            const botMessage = {
                id: Date.now() + 1, 
                text: response.data.reply,
                sender: 'bot'
            };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "Sorry, something went wrong. Please try again.",
                sender: 'bot'
            };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const chatContainerStyle = {
        maxWidth: '500px',
        margin: '20px auto',
        border: '1px solid #ccc',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        height: '70vh', 
        fontFamily: 'Arial, sans-serif'
    };

    const messagesAreaStyle = {
        flexGrow: 1,
        padding: '15px',
        overflowY: 'auto', 
        borderBottom: '1px solid #eee'
    };

    const messageStyle = (sender) => ({
        marginBottom: '10px',
        padding: '8px 12px',
        borderRadius: '15px',
        maxWidth: '70%',
        wordWrap: 'break-word',
        alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
        background: sender === 'user' ? '#007bff' : '#e9e9eb',
        color: sender === 'user' ? 'white' : 'black',
        marginLeft: sender === 'user' ? 'auto' : '0',
        marginRight: sender === 'bot' ? 'auto' : '0',
    });

    const formStyle = {
        display: 'flex',
        padding: '10px'
    };

    const inputStyle = {
        flexGrow: 1,
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px 0 0 5px',
        marginRight: '-1px' 
    };

    const buttonStyle = {
        padding: '10px 15px',
        border: '1px solid #007bff',
        background: '#007bff',
        color: 'white',
        cursor: 'pointer',
        borderRadius: '0 5px 5px 0'
    };

    return (
        <div style={chatContainerStyle}>
            <div style={messagesAreaStyle}>
                {messages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={messageStyle(msg.sender)}>
                            <p><strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && <p style={{textAlign: 'center', fontStyle: 'italic', color: '#777'}}>Bot is typing...</p>}
                <div ref={messagesEndRef} /> 
            </div>
            <form onSubmit={handleSubmit} style={formStyle}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    style={inputStyle}
                    disabled={isLoading}
                />
                <button type="submit" style={buttonStyle} disabled={isLoading || !inputValue.trim()}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default SimpleChatbot;