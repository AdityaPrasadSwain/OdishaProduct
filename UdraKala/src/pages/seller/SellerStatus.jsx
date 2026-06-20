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
        <div className="min-h-screen bg-bg-page dark:bg-bg-dark flex items-center justify-center p-4">
            <Motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-bg-surface dark:bg-bg-dark rounded-2xl shadow-xl max-w-md w-full p-8 text-center border border-border dark:border-border"
            >
                <div className="w-20 h-20 bg-primary-light dark:bg-primary-hover/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-primary dark:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-text-primary dark:text-text-onDark mb-3">
                    Account Pending Approval
                </h2>

                <p className="text-text-secondary dark:text-text-secondary mb-8 leading-relaxed">
                    Thank you for registering! Your seller account is currently under review.
                    <br />
                    <span className="font-medium text-primary dark:text-primary block mt-2">
                        Approval typically takes 24–48 hours.
                    </span>
                </p>

                <div className="space-y-3">
                    <button
                        onClick={handleHome}
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-text-onDark font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-orange-500/30"
                    >
                        Go to Home Page
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-bg-band dark:bg-bg-dark hover:bg-bg-band dark:hover:bg-bg-dark text-text-secondary dark:text-text-secondary font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
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
