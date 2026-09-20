import { useState, useRef, useEffect } from 'react';
import { Menu as LucideMenu, Sun, Moon, Search, User, ShoppingCart, Settings, LogOut, LayoutDashboard, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import udraKalaLogo from '../../assets/logo.jpg';
import NotificationBell from '../../components/common/NotificationBell';
import AccountDropdown from '../../components/AccountDropdown';
import { useAccountMenuItems } from '../../hooks/useAccountMenuItems';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const { cart } = useData();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

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

    const headerMenuItems = useAccountMenuItems(logout);

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
                    <AccountDropdown user={user} menuItems={headerMenuItems} />
                </div>
            </div>
        </header>
    );
};

export default Header;
