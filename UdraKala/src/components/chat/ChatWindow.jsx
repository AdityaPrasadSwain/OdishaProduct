import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Minimize2, MessageCircle } from 'lucide-react';
import chatApi from '../../api/chatApi';
import ChatMessage from './ChatMessage';

const ChatWindow = ({ onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState(localStorage.getItem('chatSessionId'));
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const initializeChat = async () => {
            let sid = sessionId;
            if (!sid) {
                // Try to start a new session
                try {
                    const session = await chatApi.startSession();
                    sid = session.id;
                    setSessionId(sid);
                    localStorage.setItem('chatSessionId', sid);

                    setMessages([{
                        id: 'init',
                        sender: 'BOT',
                        message: 'Namaste! 🙏 Welcome to UdraKala. I am here to help you find the best Handloom & Handicrafts. How can I assist you today?',
                        sentAt: new Date().toISOString()
                    }]);
                } catch (e) {
                    console.error("Init failed", e);
                }
            } else {
                try {
                    const history = await chatApi.getHistory(sid);
                    if (history.length > 0) {
                        setMessages(history);
                    } else {
                        setMessages([{
                            id: 'init',
                            sender: 'BOT',
                            message: 'Hello! 👋 Welcome back. How can I assist you today?',
                            sentAt: new Date().toISOString()
                        }]);
                    }
                } catch (e) {
                    console.error("History failed", e);
                    localStorage.removeItem('chatSessionId');
                }
            }
        };

        initializeChat();
    }, []);

    const initSession = async () => {
        try {
            const session = await chatApi.startSession();
            const sid = session.id;
            setSessionId(sid);
            localStorage.setItem('chatSessionId', sid);
            return sid;
        } catch (error) {
            console.error("Failed to start session", error);
            return null;
        }
    };

    const handleSend = async (text) => {
        // If triggered by form submit, prevent default reload
        if (text && typeof text.preventDefault === 'function') {
            text.preventDefault();
        }

        // Allow text to be passed directly (from options) or use state input
        const userMsgText = typeof text === 'string' ? text : input;

        if (!userMsgText.trim()) return;

        // Auto-connect if no session
        let currentSessionId = sessionId;
        if (!currentSessionId) {
            setLoading(true);
            currentSessionId = await initSession();
            if (!currentSessionId) {
                setMessages(prev => [...prev, { id: Date.now(), sender: 'BOT', message: 'Could not connect to server. Please try again later.', sentAt: new Date().toISOString() }]);
                setLoading(false);
                return;
            }
        }

        if (typeof text !== 'string') setInput(''); // Clear input if it was typed

        // Optimistic UI update
        const tempId = Date.now();
        const userMsg = { id: tempId, sender: 'USER', message: userMsgText, sentAt: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const response = await chatApi.sendMessage(currentSessionId, userMsgText);
            setMessages(prev => [...prev, response]); // Append Bot Response
        } catch (error) {
            console.error("Message send failed", error);
            // Fallback error message
            setMessages(prev => [...prev, { id: Date.now(), sender: 'BOT', message: 'Sorry, I am having trouble connecting. Please try again.', sentAt: new Date().toISOString() }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-orange-600 p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                    <MessageCircle size={20} />
                    <h3 className="font-semibold">24x7 Help Center</h3>
                </div>
                <button onClick={onClose} className="hover:bg-orange-700 p-1 rounded transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.map((msg, index) => (
                    <ChatMessage
                        key={msg.id || index}
                        message={msg}
                        onOptionClick={(opt) => handleSend(opt)}
                    />
                ))}
                {loading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-gray-100 rounded-2xl px-4 py-2 rounded-tl-none">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
