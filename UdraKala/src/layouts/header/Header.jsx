import { useState, useRef, useEffect } from 'react';
import { Menu as LucideMenu, Sun, Moon, Search, User, ShoppingCart, Settings, LogOut, LayoutDashboard, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import udraKalaLogo from '../../assets/logo.jpg';
import NotificationBell from '../../components/common/NotificationBell';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const { cart } = useData();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Determine dashboard path based on role
    const getDashboardPath = () => {
        if (user?.roles?.includes('ROLE_ADMIN')) return '/admin/dashboard';
        if (user?.roles?.includes('ROLE_SELLER')) return '/seller/dashboard';
        return '/customer/dashboard';
    };

    const getAnalyticsPath = () => {
        if (user?.roles?.includes('ROLE_ADMIN')) return '/admin/analytics';
        return '/admin/analytics';
    };

    return (
        <header className="sticky top-0 z-40 bg-bg-surface/80 dark:bg-bg-dark/80 backdrop-blur-xl border-b border-border/50 dark:border-transparent dark:shadow-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] px-4 md:px-8 h-16 flex items-center justify-between transition-all duration-300 shadow-sm">
            {/* Left Side: Logo/Search */}
            <div className="flex items-center gap-8">
                {/* Logo */}
                <a href={getDashboardPath()} className="flex items-center group relative z-10">
                    <motion.div 
                        whileHover={{ rotate: 10, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative overflow-hidden rounded-full mr-3 border-2 border-transparent bg-clip-padding"
                        style={{
                            backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #10b981, #3b82f6)',
                            backgroundOrigin: 'border-box',
                            backgroundClip: 'padding-box, border-box'
                        }}
                    >
                        <img src={udraKalaLogo} className="h-8 w-8 object-cover" alt="UdraKala Logo" />
                    </motion.div>
                    <span className="self-center whitespace-nowrap text-xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 tracking-tight hidden sm:block">
                        UdraKala
                    </span>
                </a>
            </div>

            {/* Right Side: Navigation & Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
                {/* Navigation Links (Desktop) */}
                <nav className="hidden md:flex items-center gap-1">
                    <a href={getDashboardPath()} className="px-4 py-2 rounded-full text-sm font-semibold text-text-secondary dark:text-text-secondary hover:text-primary hover:bg-bg-band dark:hover:bg-bg-dark transition-all">
                        Dashboard
                    </a>
                    <a href={getAnalyticsPath()} className="px-4 py-2 rounded-full text-sm font-semibold text-text-secondary dark:text-text-secondary hover:text-primary hover:bg-bg-band dark:hover:bg-bg-dark transition-all">
                        Analytics
                    </a>
                </nav>

                <div className="h-6 w-px bg-bg-band dark:bg-bg-dark hidden md:block mx-1"></div>

                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Theme Toggle */}
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTheme} 
                        className="p-2.5 rounded-full hover:bg-bg-band dark:hover:bg-bg-dark text-text-secondary dark:text-text-secondary transition-colors focus:outline-none"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={theme}
                                initial={{ y: -20, opacity: 0, rotate: -90 }}
                                animate={{ y: 0, opacity: 1, rotate: 0 }}
                                exit={{ y: 20, opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.button>

                    {/* Notifications */}
                    <NotificationBell />

                    {/* Profile & Account Menu */}
                    <div className="relative" ref={userMenuRef}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsUserMenuOpen(prev => !prev)}
                            className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full focus:outline-none border-2 border-transparent focus:border-primary transition-all shadow-sm"
                        >
                            {user?.profileImage ? (
                                <img
                                    className="w-full h-full rounded-full object-cover"
                                    src={user.profileImage}
                                    alt="user photo"
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/default_profile.jpg'; }}
                                />
                            ) : (
                                <div className="w-full h-full rounded-full flex items-center justify-center text-sm font-bold text-text-onDark bg-gradient-to-br from-primary-400 to-primary-600">
                                    {(user?.fullName?.charAt(0) || user?.name?.charAt(0) || "U").toUpperCase()}
                                </div>
                            )}
                        </motion.button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div 
                                    key="user-menu"
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-3 w-56 bg-bg-surface/95 dark:bg-bg-dark/95 backdrop-blur-xl border border-border dark:border-border rounded-2xl shadow-xl origin-top-right z-50 overflow-hidden"
                                >
                                    <div className="px-4 py-3 bg-gradient-to-b from-gray-50 to-white dark:from-secondary-800 dark:to-secondary-800/90 border-b border-border dark:border-border">
                                        <span className="block text-sm text-text-primary dark:text-text-onDark font-bold truncate">{user?.fullName || user?.name || "Profile"}</span>
                                        <span className="block text-xs text-text-secondary truncate dark:text-text-secondary mt-1">{user?.email || "user@example.com"}</span>
                                    </div>
                                    <div className="py-2">
                                        <a href={getDashboardPath()} className="flex items-center px-4 py-2.5 text-sm w-full text-text-secondary dark:text-text-secondary hover:bg-bg-band dark:hover:bg-bg-dark/50 hover:text-primary dark:hover:text-primary transition-colors">
                                            <LayoutDashboard size={18} className="mr-3 opacity-80" />
                                            <span className="font-medium">Dashboard</span>
                                        </a>
                                        <button className="flex items-center px-4 py-2.5 text-sm w-full text-text-secondary dark:text-text-secondary hover:bg-bg-band dark:hover:bg-bg-dark/50 hover:text-primary dark:hover:text-primary transition-colors">
                                            <Settings size={18} className="mr-3 opacity-80" />
                                            <span className="font-medium">Settings</span>
                                        </button>
                                    </div>
                                    <div className="p-2 border-t border-border dark:border-border bg-bg-page dark:bg-bg-dark/50">
                                        <button 
                                            onClick={() => { setIsUserMenuOpen(false); logout(); }} 
                                            className="flex items-center px-4 py-2.5 text-sm w-full text-status-error dark:text-red-400 hover:bg-red-50 dark:hover:text-status-error/20 rounded-xl transition-colors"
                                        >
                                            <LogOut size={18} className="mr-3 opacity-80" />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
