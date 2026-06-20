import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Sun, Moon, User, Heart, Settings, LayoutDashboard, Menu, X, RotateCw, Search, Package, Ticket, Coins, Zap, CreditCard, MapPin, Gift, Bell, ChevronDown, Shirt, Smartphone, MonitorPlay, Home, Armchair, Smile, Sparkles } from 'lucide-react';
import AccountDropdown from './AccountDropdown';
import CategoryNavBar from './CategoryNavBar';
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

    const CATEGORY_ITEMS = [
        { id: 'fashion', label: "Fashion", icon: Shirt, href: "/products?category=Fashion" },
        { id: 'mobiles', label: "Mobiles", icon: Smartphone, href: "/products?category=Mobiles" },
        { id: 'electronics', label: "Electronics", icon: MonitorPlay, href: "/products?category=Electronics" },
        { id: 'home', label: "Home", icon: Home, href: "/products?category=Home" },
        { id: 'furniture', label: "Furniture", icon: Armchair, href: "/products?category=Furniture" },
        { id: 'toys', label: "Toys", icon: Smile, href: "/products?category=Toys" },
        { id: 'beauty', label: "Beauty", icon: Sparkles, href: "/products?category=Beauty" },
    ];

    const accountMenuItems = [];
    const dashboards = [];
    if (isAdmin) dashboards.push({ label: t('admin_dashboard'), icon: LayoutDashboard, to: "/admin/dashboard" });
    if (isSeller) dashboards.push({ label: t('seller_dashboard'), icon: LayoutDashboard, to: "/seller/dashboard" });
    if (isAgent) dashboards.push({ label: t('agent_dashboard'), icon: LayoutDashboard, to: "/agent/dashboard" });
    if (isCustomer) dashboards.push({ label: t('my_dashboard'), icon: LayoutDashboard, to: "/customer/dashboard" });
    
    if (dashboards.length > 0) {
        accountMenuItems.push({ title: 'Dashboards', items: dashboards });
    }

    accountMenuItems.push({
        title: 'Your Account',
        items: [
            { label: "My Profile", icon: User, to: "/profile" },
            { label: "Orders", icon: Package, to: "/orders" },
            { label: "Coupons", icon: Ticket, to: "/coupons" },
            { label: "Supercoin", icon: Coins, to: "/supercoin" },
            { label: "UdraKala Plus Zone", icon: Zap, to: "/plus-zone" },
            { label: "Saved Cards & Wallet", icon: CreditCard, to: "/wallet" },
            { label: "Saved Addresses", icon: MapPin, to: "/addresses" },
            { label: "Wishlist", icon: Heart, to: "/wishlist" },
            { label: "Gift Cards", icon: Gift, to: "/gift-cards" },
            { label: "Notifications", icon: Bell, to: "/notifications" },
        ]
    });

    accountMenuItems.push({
        items: [
            { label: "Logout", icon: LogOut, onClick: handleLogout, isDanger: true }
        ]
    });

    return (
        <>
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

                                <AccountDropdown user={user} menuItems={accountMenuItems} />
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
        
        {/* Render category bar below the fixed nav (height 20 = 5rem = 80px) */}
        <div className="pt-20">
            <CategoryNavBar categories={CATEGORY_ITEMS} />
        </div>
        </>
    );
};

export default CustomNavbar;
