import { useEffect } from 'react';
import { motion as Motion } from 'motion/react';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { state } = useLocation();


    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
            <Motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="bg-white dark:bg-gray-900 max-w-md w-full rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 text-center relative"
            >
                {/* Decorative Background Mesh */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none" />

                <div className="p-8 pb-12 relative z-10">
                    <Motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
                    >
                        <CheckCircle size={48} className="text-white" strokeWidth={3} />
                    </Motion.div>

                    <Motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                    >
                        Payment Successful!
                    </Motion.h1>

                    <Motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-500 dark:text-gray-400 mb-8"
                    >
                        Thank you for your purchase. Your order has been confirmed and will be shipped soon.
                    </Motion.p>

                    <div className="space-y-3">
                        <Motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            onClick={() => navigate('/customer/orders')}
                            className="w-full py-3.5 px-6 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-2 group"
                        >
                            View Order Details
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Motion.button>

                        <Motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            onClick={() => navigate('/products')}
                            className="w-full py-3.5 px-6 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={18} />
                            Continue Shopping
                        </Motion.button>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800">
                    Transaction ID: {state?.paymentIntentId || 'TXN_PENDING'}
                </div>
            </Motion.div>
        </div>
    );
};

export default PaymentSuccess;
