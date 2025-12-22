import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import ChatWindow from './ChatWindow';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <Motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-orange-700 transition-colors"
                >
                    <MessageCircle size={28} />
                </Motion.button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <ChatWindow onClose={() => setIsOpen(false)} />
            )}
        </>
    );
};

export default ChatWidget;
