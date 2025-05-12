const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();

    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
        return "Hello there! How can I help you today?";
    }
    if (message.includes("how are you")) {
        return "I'm just a bunch of code, but I'm doing well! Thanks for asking.";
    }
    if (message.includes("course") || message.includes("courses")) {
        return "You can view available courses on the 'All Courses' page. To see your registered courses, go to 'My Courses'. What specific information are you looking for?";
    }
    if (message.includes("register") && message.includes("course")) {
        return "To register for a course, go to the 'All Courses' page, find the course you're interested in, and click the 'Register' button. You need to be logged in.";
    }
    if (message.includes("drop") && message.includes("course")) {
        return "To drop a course, go to 'My Courses', find the course you wish to drop, and click the 'Drop Course' button.";
    }
    if (message.includes("login") || message.includes("sign in")) {
        return "You can log in by clicking the 'Login' link in the navigation bar.";
    }
    if (message.includes("bye") || message.includes("goodbye")) {
        return "Goodbye! Have a great day.";
    }
    if (message.includes("help")) {
        return "I can help you with questions about courses, registration, login, or general information. Try asking something like 'How do I register for a course?' or 'Tell me about courses'.";
    }

    const randomResponses = [
        "I'm not sure how to answer that. Can you try rephrasing?",
        "Interesting question! I'm still learning.",
        "I don't have information on that topic right now.",
        "Could you please ask something else related to course registration?"
    ];
    return randomResponses[Math.floor(Math.random() * randomResponses.length)];
};


exports.respondToMessage = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ msg: 'Message is required' });
    }

    try {
        const botReply = getBotResponse(message);
        setTimeout(() => {
            res.json({ reply: botReply });
        }, 500 + Math.random() * 500);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};