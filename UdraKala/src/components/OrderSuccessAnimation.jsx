import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const OrderSuccessAnimation = ({ onContinueShopping }) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleContinue = () => {
        if (onContinueShopping) {
            onContinueShopping();
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-[#F2FFF4] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center text-center relative overflow-hidden"
            >
                {/* Confetti Background Effect (Subtle) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-green-200"
                            initial={{ opacity: 0, y: 50, x: 0 }}
                            animate={{
                                opacity: [0, 1, 0],
                                y: [-20, -100],
                                x: (i % 2 === 0 ? 50 : -50) + (Math.random() * 20),
                                scale: [0, 1.2, 0]
                            }}
                            transition={{
                                delay: 0.8 + (i * 0.1),
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                            style={{
                                left: `${20 + (i * 15)}%`,
                                bottom: '40%'
                            }}
                        />
                    ))}
                </div>

                {/* Animated Icon Container */}
                <div className="mb-6 relative w-24 h-24 flex items-center justify-center">
                    {/* Pulsing Bg Circle */}
                    <motion.div
                        className="absolute inset-0 bg-green-100 rounded-full"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />

                    {/* Main Success Circle */}
                    <motion.div
                        className="w-20 h-20 bg-gradient-to-tr from-green-500 to-green-400 rounded-full flex items-center justify-center shadow-lg shadow-green-200 z-10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.2
                        }}
                    >
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 50 50"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <motion.path
                                d="M10 25 L20 35 L40 15"
                                stroke="white"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                    delay: 0.5
                                }}
                            />
                        </svg>
                    </motion.div>
                </div>

                {/* Text Animations */}
                <motion.h2
                    className="text-2xl font-bold text-gray-800 mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    Order Confirmed
                </motion.h2>

                <motion.p
                    className="text-gray-500 mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    Thanks for shopping with us! <br /> Your happiness is on its way.
                </motion.p>

                {/* Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, type: "spring" }}
                    onClick={handleContinue}
                    className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl shadow-lg shadow-slate-200 hover:shadow-xl transition-all"
                >
                    Continue Shopping
                </motion.button>
            </motion.div>
        </div>
    );
};

export default OrderSuccessAnimation;
