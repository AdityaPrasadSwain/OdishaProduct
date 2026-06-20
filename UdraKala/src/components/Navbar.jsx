import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Sun, Moon, User, Heart, Settings, LayoutDashboard, Menu, X, RotateCw, Search, Package, Ticket, Coins, Zap, CreditCard, MapPin, Gift, Bell, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { languages } from '../config/languages';
import NotificationBell from './NotificationBell';
import AdminNotificationBell from './admin/AdminNotificationBell';
import udraKalaLogo from '../assets/logo.jpg';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

const ThemeToggleBtn = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-band dark:hover:bg-bg-dark transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

// --- Logo & Brand ---
const Logo = ({ isAdmin, isSeller, isAgent }) => (
    <Link to={isAdmin ? "/admin/dashboard" : isSeller ? "/seller/dashboard" : isAgent ? "/agent/dashboard" : "/"} className="flex items-center gap-2 group relative z-10">
        <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src={udraKalaLogo} className="w-full h-full object-cover" alt="UdraKala Logo" />
        </div>
        <div className="flex flex-col">
            <span className="text-xl font-bold font-sans tracking-tight text-text-primary dark:text-text-onDark">
                Udra<span className="text-primary">Kala</span>
            </span>
        </div>
    </Link>
);

// --- Dropdown Menu Item Helper ---
const DropdownItem = ({ to, icon: Icon, label, onClick, setIsUserMenuOpen, className = "", isDanger = false }) => {
    const baseClass = `flex items-center px-4 py-2.5 text-sm w-full transition-colors ${isDanger ? 'text-status-error hover:bg-red-50 dark:hover:text-status-error/20' : 'text-text-secondary hover:bg-bg-page dark:hover:bg-bg-dark hover:text-primary'} ${className}`;

    if (to) {
        return (
            <Link to={to} className={baseClass} onClick={() => setIsUserMenuOpen(false)}>
                {Icon && <Icon size={18} className="mr-3 opacity-80" />}
                <span className="font-medium">{label}</span>
            </Link>
        );
    }
    return (
        <button onClick={() => { onClick && onClick(); setIsUserMenuOpen(false); }} className={`text-left ${baseClass}`}>
            {Icon && <Icon size={18} className="mr-3 opacity-80" />}
            <span className="font-medium">{label}</span>
        </button>
    );
};

const CustomNavbar = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, loading } = useAuth();
    const { cart } = useData();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const userMenuRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);

    const handleLogout = async () => {
        await logout();
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (loading) return null;

    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    const isSeller = user?.roles?.includes('ROLE_SELLER');
    const isCustomer = user?.roles?.includes('ROLE_CUSTOMER');
    const isAgent = user?.roles?.includes('ROLE_DELIVERY_AGENT');
    const isGuest = !user;

    return (
        <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled ? 'bg-bg-surface/90 dark:bg-bg-dark/90 backdrop-blur-md border-b border-border dark:border-border shadow-sm' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* Left: Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Logo isAdmin={isAdmin} isSeller={isSeller} isAgent={isAgent} />
                    </div>

                    {/* Center: Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 items-center justify-center px-8">
                        <form onSubmit={handleSearch} className="w-full max-w-lg relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search products, categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3 bg-bg-band dark:bg-bg-dark border-transparent rounded-full text-sm placeholder-text-secondary focus:bg-bg-surface dark:focus:bg-bg-dark focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                            />
                        </form>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        <ThemeToggleBtn />

                        {!isGuest && (
                            <>
                                <div className="hidden sm:block">
                                    {isAdmin ? <AdminNotificationBell /> : <NotificationBell />}
                                </div>

                                {isCustomer && (
                                    <>
                                        <Link to="/wishlist" className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-band dark:hover:bg-bg-dark transition-colors">
                                            <Heart size={20} />
                                        </Link>
                                        <Link to="/cart" className="relative w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-band dark:hover:bg-bg-dark transition-colors">
                                            <ShoppingCart size={20} />
                                            {cart.length > 0 && (
                                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-text-onDark bg-primary rounded-full translate-x-1/4 -translate-y-1/4">
                                                    {cart.reduce((t, i) => t + i.quantity, 0)}
                                                </span>
                                            )}
                                        </Link>
                                    </>
                                )}

                                <div className="relative ml-2" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center justify-center gap-2 px-2 py-1 rounded-full border border-transparent hover:border-border transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-border dark:border-border">
                                            {user?.profileImage ? (
                                                <img src={user.profileImage} alt="User" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-primary flex items-center justify-center text-text-onDark font-bold">
                                                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <span className="hidden lg:block text-sm font-semibold text-text-primary dark:text-text-onDark uppercase max-w-[120px] truncate">
                                            {user?.fullName || 'USER'}
                                        </span>
                                        <ChevronDown size={16} className={`hidden lg:block text-text-secondary transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* User Dropdown */}
                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-3 w-64 bg-bg-surface dark:bg-bg-dark rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-border dark:border-border overflow-hidden z-50"
                                            >
                                                <div className="py-2">
                                                    {(isAdmin || isSeller || isAgent || isCustomer) && (
                                                        <>
                                                            <div className="px-4 pt-2 pb-1 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Dashboards</div>
                                                            {isAdmin && <DropdownItem to="/admin/dashboard" icon={LayoutDashboard} label={t('admin_dashboard')} setIsUserMenuOpen={setIsUserMenuOpen} />}
                                                            {isSeller && <DropdownItem to="/seller/dashboard" icon={LayoutDashboard} label={t('seller_dashboard')} setIsUserMenuOpen={setIsUserMenuOpen} />}
                                                            {isAgent && <DropdownItem to="/agent/dashboard" icon={LayoutDashboard} label={t('agent_dashboard')} setIsUserMenuOpen={setIsUserMenuOpen} />}
                                                            {isCustomer && <DropdownItem to="/customer/dashboard" icon={LayoutDashboard} label={t('my_dashboard')} setIsUserMenuOpen={setIsUserMenuOpen} />}
                                                            <div className="h-px bg-border dark:bg-border my-1"></div>
                                                        </>
                                                    )}
                                                    
                                                    <div className="px-4 pt-2 pb-1 text-[13px] font-bold text-text-primary dark:text-text-onDark">Your Account</div>
                                                    
                                                    <DropdownItem to="/profile" icon={User} label="My Profile" setIsUserMenuOpen={setIsUserMenuOpen} className="!py-2" />
                                                    <DropdownItem to="/orders" icon={Package} label="Orders" setIsUserMenuOpen={setIsUserMenuOpen} className="!py-2" />
                                                    <DropdownItem to="/coupons" icon={Ticket} label="Coupons" setIsUserMenuOpen={setIsUserMenuOpen} className="!py-2" />
                                                    <DropdownItem to="/supercoin" icon={Coins} label="Supercoin" setIsUserMenuOpen={setIsUserMenuOpen} className="!py-2" />
                                                    <DropdownItem to="/plus-zone" icon={Zap} label="UdraKala Plus Zone" setIsUserMenuOpen={setIsUserMenuOpen} className="!py-2" />
                                                    <DropdownItem to="/wallet" icon={CreditCard} label="Saved Cards & Wallet" setIsUserMenuOpen={setIsUserMenuOpen} className="!py-2" />
                                                    <DropdownItem to="/addresses" icon={MapPin} label="Saved Addresses" setIsUserMenuOpen={setIsUserMenuOpen} className="!py-2" />
                                                    <DropdownItem to="/wishlist" icon={Heart} label="Wishlist" setIsUserMenuOpen={setIsUserMenuOpen} className="!py-2" />
                                                    <DropdownItem to="/gift-cards" icon={Gift} label="Gift Cards" setIsUserMenuOpen={setIsUserMenuOpen} className="!py-2" />
                                                    <DropdownItem to="/notifications" icon={Bell} label="Notifications" setIsUserMenuOpen={setIsUserMenuOpen} className="!py-2" />
                                                    
                                                    <div className="h-px bg-border dark:bg-border my-1"></div>
                                                    
                                                    <DropdownItem onClick={handleLogout} icon={LogOut} label="Logout" setIsUserMenuOpen={setIsUserMenuOpen} className="!py-2" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        )}

                        {isGuest && (
                            <div className="hidden sm:flex items-center gap-2 ml-2">
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                                    Log In
                                </Link>
                                <Link to="/register" className="px-6 py-2.5 text-sm font-bold text-text-onDark bg-primary rounded-full hover:bg-primary-dark transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-text-secondary hover:bg-bg-band dark:hover:bg-bg-dark rounded-full"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-bg-surface dark:bg-bg-dark border-b border-border dark:border-border"
                    >
                        <div className="px-4 py-4 space-y-4">
                            <form onSubmit={(e) => { handleSearch(e); setIsMenuOpen(false); }} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                                    <Search size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-bg-page dark:bg-bg-dark border-transparent rounded-full text-sm"
                                />
                            </form>
                            {isGuest && (
                                <div className="flex flex-col gap-2 pt-2 border-t border-border dark:border-border">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full px-4 py-2.5 text-center text-sm font-medium text-text-secondary bg-bg-band dark:bg-bg-dark rounded-full">
                                        Log In
                                    </Link>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full px-4 py-2.5 text-center text-sm font-bold text-text-onDark bg-primary rounded-full">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default CustomNavbar;
