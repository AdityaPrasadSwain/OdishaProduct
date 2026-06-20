import React from 'react';
import { motion as Motion } from 'motion/react';

const ChatMessage = ({ message, onOptionClick }) => {
    const isBot = message.sender === 'BOT';
    const options = message.options ? JSON.parse(message.options) : null;
    let payload = null;
    try {
        payload = message.payload ? JSON.parse(message.payload) : null;
    } catch (e) {
        console.error("Failed to parse payload", e);
    }

    return (
        <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} mb-4`}
        >
            <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${isBot
                    ? 'bg-bg-band text-text-primary rounded-tl-none'
                    : 'bg-primary text-text-onDark rounded-tr-none'
                    }`}
            >
                <p className="text-sm pre-wrap">{message.message}</p>
                <span className="text-xs opacity-70 mt-1 block">
                    {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {/* Render Order List Payload */}
            {isBot && payload && payload.type === 'ORDER_LIST' && (
                <div className="flex flex-col gap-2 mt-2 w-full max-w-[85%]">
                    {payload.orders.map((order) => (
                        <div
                            key={order.orderId}
                            onClick={() => onOptionClick && onOptionClick(`ORDER_SELECTED:${order.orderId}`)}
                            className="bg-bg-surface border border-border rounded-xl p-3 shadow-sm hover:shadow-md cursor-pointer transition-shadow flex justify-between items-center group"
                        >
                            <div>
                                <p className="font-semibold text-sm text-text-primary">Order #{order.orderId.substring(0, 8)}</p>
                                <p className="text-xs text-text-secondary">{new Date(order.orderDate).toLocaleDateString()}</p>
                                <p className="text-xs font-medium text-primary mt-1">₹{order.amount}</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-primary-light text-primary'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Render Options if any */}
            {isBot && options && options.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 max-w-[85%]">
                    {options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => onOptionClick && onOptionClick(opt)}
                            className="px-3 py-1.5 bg-bg-band text-primary text-sm border border-primary rounded-full hover:bg-primary-light transition-colors"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </Motion.div>
    );
};

export default ChatMessage;
