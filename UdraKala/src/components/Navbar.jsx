import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Sun, Moon, User, Heart, Settings, LayoutDashboard, Menu, X, RotateCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

// --- Logo & Brand ---
const Logo = ({ isAdmin, isSeller, isAgent }) => (
    <Link to={isAdmin ? "/admin/dashboard" : isSeller ? "/seller/dashboard" : isAgent ? "/agent/dashboard" : "/"} className="flex items-center">
        <img src={udraKalaLogo} className="mr-3 h-9 w-9 rounded-full sm:h-10 sm:w-10 border border-orange-200" alt="UdraKala Logo" />
        <div className="flex flex-col">
            <span className="self-center whitespace-nowrap text-xl font-bold dark:text-white text-orange-800" style={{ fontFamily: 'serif' }}>
                UdraKala
            </span>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-sans">
                {isAdmin ? "Admin Panel" : isSeller ? "Seller Central" : "Art of Odisha"}
            </span>
        </div>
    </Link>
);

// --- Drodown Menu Item Helper ---
const DropdownItem = ({ to, icon: Icon, label, onClick, setIsUserMenuOpen, className = "", isDanger = false }) => {
    const baseClass = `flex items-center px-4 py-2 text-sm w-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${isDanger ? 'text-red-600 dark:text-red-400 hover:text-red-700' : 'text-gray-700 dark:text-gray-200'} ${className}`;

    if (to) {
        return (
            <Link to={to} className={baseClass} onClick={() => setIsUserMenuOpen(false)}>
                {Icon && <Icon size={16} className="mr-2" />}
                {label}
            </Link>
        );
    }
    return (
        <button onClick={() => { onClick && onClick(); setIsUserMenuOpen(false); }} className={`text-left ${baseClass}`}>
            {Icon && <Icon size={16} className="mr-2" />}
            {label}
        </button>
    );
};

const CustomNavbar = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user, logout, loading } = useAuth();
    const { cart } = useData();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const handleLogout = async () => {
        await logout();
    };

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (loading) return null;

    // --- Role Helpers ---
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    const isSeller = user?.roles?.includes('ROLE_SELLER');
    const isCustomer = user?.roles?.includes('ROLE_CUSTOMER');
    const isAgent = user?.roles?.includes('ROLE_DELIVERY_AGENT');
    const isGuest = !user;

    // --- Right Side Actions ---
    return (
        <nav className="bg-white/80 dark:bg-secondary-900/80 sticky top-0 z-50 shadow-sm hover:shadow-md transition-shadow duration-300 border-b border-secondary-200 dark:border-secondary-800 backdrop-blur-xl">
            <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <Logo isAdmin={isAdmin} isSeller={isSeller} isAgent={isAgent} />

                <div className="flex items-center md:order-2 space-x-2 md:space-x-3">
                    {/* Theme Toggle */}
                    <ThemeToggleBtn />

                    {/* Authenticated Actions */}
                    {!isGuest && (
                        <>
                            {/* Notifications */}
                            {isAdmin ? <AdminNotificationBell /> : <NotificationBell />}

                            {/* Customer Specific: Wishlist & Cart */}
                            {isCustomer && (
                                <>
                                    <Link to="/wishlist" className="relative p-2.5 text-secondary-600 hover:bg-secondary-100 dark:text-gray-300 dark:hover:bg-secondary-800 rounded-full hidden sm:block transition-colors">
                                        <Heart size={20} strokeWidth={2} />
                                    </Link>
                                    <Link to="/cart" className="relative p-2.5 text-secondary-600 hover:bg-secondary-100 dark:text-gray-300 dark:hover:bg-secondary-800 rounded-full transition-colors">
                                        <ShoppingCart size={20} strokeWidth={2} />
                                        {cart.length > 0 && (
                                            <div className="absolute inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-primary-600 border-2 border-white rounded-full -top-0 -right-0 dark:border-secondary-900">
                                                {cart.reduce((t, i) => t + i.quantity, 0)}
                                            </div>
                                        )}
                                    </Link>
                                </>
                            )}

                            {/* Custom User Dropdown */}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex text-sm bg-secondary-200 rounded-full md:mr-0 focus:ring-2 focus:ring-primary-300 dark:focus:ring-secondary-600"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    {user?.profileImage ? (
                                        <img
                                            className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-secondary-700"
                                            src={user.profileImage}
                                            alt="user photo"
                                            onError={(e) => { e.target.onerror = null; e.target.src = '/default_profile.jpg'; }}
                                        />
                                    ) : (
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${isAdmin ? "bg-red-600" : isSeller ? "bg-primary-500" : isAgent ? "bg-blue-600" : "bg-secondary-600"}`}>
                                            {(user?.fullName?.charAt(0) || "U").toUpperCase()}
                                        </div>
                                    )}
                                </button>

                                {/* Dropdown Body */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white divide-y divide-secondary-100 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 dark:bg-secondary-800 dark:divide-secondary-700 origin-top-right z-50 focus:outline-none">
                                        <div className="px-4 py-3.5 bg-secondary-50 dark:bg-secondary-800/50 rounded-t-xl">
                                            <span className="block text-sm text-secondary-900 dark:text-white font-bold tracking-tight">{user.fullName || user.email}</span>
                                            <span className="block text-xs text-secondary-500 truncate dark:text-gray-400 mt-0.5">{user.email}</span>
                                        </div>
                                        <div className="py-2">
                                            {isAdmin && <DropdownItem to="/admin/dashboard" icon={LayoutDashboard} label={t('admin_dashboard')} setIsUserMenuOpen={setIsUserMenuOpen} />}
                                            {isSeller && <DropdownItem to="/seller/dashboard" icon={LayoutDashboard} label={t('seller_dashboard')} setIsUserMenuOpen={setIsUserMenuOpen} />}
                                            {isAgent && <DropdownItem to="/agent/dashboard" icon={LayoutDashboard} label={t('agent_dashboard')} setIsUserMenuOpen={setIsUserMenuOpen} />}
                                            {isCustomer && <DropdownItem to="/customer/dashboard" icon={LayoutDashboard} label={t('my_dashboard')} setIsUserMenuOpen={setIsUserMenuOpen} />}
                                            {isCustomer && <DropdownItem to="/customer/returns" icon={RotateCw} label={t('returns_orders')} setIsUserMenuOpen={setIsUserMenuOpen} />}

                                            <DropdownItem to="/profile" icon={User} label={t('profile')} setIsUserMenuOpen={setIsUserMenuOpen} />
                                            <DropdownItem icon={Settings} label={t('settings')} setIsUserMenuOpen={setIsUserMenuOpen} />

                                            {/* Language Switcher Section */}
                                            <div className="border-t border-secondary-100 dark:border-secondary-700 my-1 pt-1">
                                                <div className="px-4 py-1 text-xs font-semibold text-secondary-500 uppercase tracking-wider dark:text-gray-400">
                                                    Language / ଭାଷା
                                                </div>
                                                {languages.map((lang) => (
                                                    <button
                                                        key={lang.code}
                                                        onClick={() => {
                                                            i18n.changeLanguage(lang.code);
                                                            setIsUserMenuOpen(false);
                                                        }}
                                                        className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${i18n.language === lang.code ? 'bg-secondary-50 dark:bg-secondary-700 font-bold text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200'}`}
                                                    >
                                                        <span className="mr-2 text-lg">{lang.flag}</span>
                                                        {lang.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="py-2">
                                            <DropdownItem onClick={handleLogout} icon={LogOut} label={t('logout')} isDanger setIsUserMenuOpen={setIsUserMenuOpen} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Guest Actions */}
                    {isGuest && (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-secondary-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white font-medium text-sm transition-colors">{t('login')}</Link>
                            <Link to="/register" className="text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/20 font-medium rounded-full text-sm px-5 py-2 transition-all transform hover:-translate-y-0.5">
                                {t('signup')}
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="inline-flex items-center p-2 justify-center text-secondary-500 rounded-lg md:hidden hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-secondary-200 dark:text-gray-400 dark:hover:bg-secondary-800 dark:focus:ring-secondary-600"
                    >
                        <span className="sr-only">Open main menu</span>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Navbar Links (Middle / Collapsible) */}
                <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto md:order-1`}>
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-secondary-100 rounded-xl bg-secondary-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-secondary-800 md:dark:bg-transparent dark:border-secondary-700">
                        {/* Guest/Customer Links */}
                        {(isGuest || isCustomer) && (
                            <>
                                <li>
                                    <Link to="/" className={`block py-2 pl-3 pr-4 rounded-lg md:p-0 transition-colors ${window.location.pathname === '/' ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'text-secondary-600 hover:bg-secondary-100 md:hover:bg-transparent md:hover:text-primary-600 dark:text-gray-300 dark:hover:text-white'}`}>
                                        {t('home')}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/products" className={`block py-2 pl-3 pr-4 rounded-lg md:p-0 transition-colors ${window.location.pathname === '/products' ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'text-secondary-600 hover:bg-secondary-100 md:hover:bg-transparent md:hover:text-primary-600 dark:text-gray-300 dark:hover:text-white'}`}>
                                        {t('products')}
                                    </Link>
                                </li>
                                {/* Become a Seller Button */}
                                <li>
                                    <Link
                                        to="/register/seller"
                                        className="block py-2 pl-3 pr-4 rounded-lg md:p-0 text-primary-600 font-semibold hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                                    >
                                        {t('become_seller')}
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* Role Specific Links - kept similar but with updated text colors if needed */}
                        {isAdmin && (
                            <>
                                <li><Link to="/admin/dashboard" className="block py-2 pl-3 pr-4 rounded text-secondary-700 hover:text-primary-600 md:p-0 dark:text-gray-300 dark:hover:text-white">{t('dashboard')}</Link></li>
                                <li><Link to="/admin/users" className="block py-2 pl-3 pr-4 rounded text-secondary-700 hover:text-primary-600 md:p-0 dark:text-gray-300 dark:hover:text-white">Users</Link></li>
                            </>
                        )}
                        {isSeller && (
                            <>
                                <li><Link to="/seller/dashboard" className="block py-2 pl-3 pr-4 rounded text-secondary-700 hover:text-primary-600 md:p-0 dark:text-gray-300 dark:hover:text-white">{t('dashboard')}</Link></li>
                                <li><Link to="/profile" className="block py-2 pl-3 pr-4 rounded text-secondary-700 hover:text-primary-600 md:p-0 dark:text-gray-300 dark:hover:text-white">{t('profile')}</Link></li>
                            </>
                        )}
                        {isAgent && (
                            <>
                                <li><Link to="/agent/dashboard" className="block py-2 pl-3 pr-4 rounded text-secondary-700 hover:text-primary-600 md:p-0 dark:text-gray-300 dark:hover:text-white">{t('dashboard')}</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default CustomNavbar;
