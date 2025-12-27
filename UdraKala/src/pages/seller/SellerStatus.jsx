import { useEffect } from 'react';
import { motion as Motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SellerStatus = () => {
    const navigate = useNavigate();
    const { logout, refreshUser, user } = useAuth();

    useEffect(() => {
        const checkStatus = async () => {
            const updatedUser = await refreshUser();
            // AuthContext now normalizes this, so we can trust isApproved
            if (updatedUser?.isApproved) {


                // If approved, verify we are still seller and valid
                navigate('/seller/dashboard');
            }
        };

        checkStatus(); // Check immediately
        const interval = setInterval(checkStatus, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [navigate, refreshUser]);

    // Also redirect if user property updates via other means
    useEffect(() => {
        if (user?.isApproved) {
            navigate('/seller/dashboard');
        }
    }, [user, navigate]);


    const handleHome = () => {
        navigate('/');
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <Motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8 text-center border border-gray-100 dark:border-gray-700"
            >
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-orange-600 dark:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Account Pending Approval
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Thank you for registering! Your seller account is currently under review.
                    <br />
                    <span className="font-medium text-orange-600 dark:text-orange-400 block mt-2">
                        Approval typically takes 24–48 hours.
                    </span>
                </p>

                <div className="space-y-3">
                    <button
                        onClick={handleHome}
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-orange-500/30"
                    >
                        Go to Home Page
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </Motion.div>
        </div>
    );
};

export default SellerStatus;
