import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Sun, Moon, User, Heart, Settings, LayoutDashboard, Menu, X, RotateCw } from 'lucide-react';
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

const CustomNavbar = () => {
    const navigate = useNavigate();
    const { user, logout, loading } = useAuth();
    const { cart } = useData();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        // Redirection is handled in AuthContext to ensure state is cleared first
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
    const isGuest = !user;

    // --- Logo & Brand ---
    const Logo = () => (
        <Link to={isAdmin ? "/admin/dashboard" : isSeller ? "/seller/dashboard" : "/"} className="flex items-center">
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
    const DropdownItem = ({ to, icon: Icon, label, onClick, className = "", isDanger = false }) => {
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

    // --- Right Side Actions ---
    return (
        <nav className="bg-white/90 dark:bg-gray-900/95 sticky top-0 z-50 shadow-md border-b border-gray-200 dark:border-gray-700 backdrop-blur-md">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Logo />

                <div className="flex items-center md:order-2 space-x-2 md:space-x-4">
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
                                    <Link to="/wishlist" className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg hidden sm:block">
                                        <Heart size={20} />
                                    </Link>
                                    <Link to="/cart" className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                        <ShoppingCart size={20} />
                                        {cart.length > 0 && (
                                            <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -right-1 dark:border-gray-900">
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
                                    className="flex text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    {user?.profileImage ? (
                                        <img className="w-8 h-8 rounded-full object-cover" src={user.profileImage} alt="user photo" />
                                    ) : (
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${isAdmin ? "bg-red-600" : isSeller ? "bg-orange-500" : "bg-gray-600"}`}>
                                            {(user?.fullName?.charAt(0) || "U").toUpperCase()}
                                        </div>
                                    )}
                                </button>

                                {/* Dropdown Body */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 origin-top-right z-50">
                                        <div className="px-4 py-3">
                                            <span className="block text-sm text-gray-900 dark:text-white font-bold">{user.fullName || user.email}</span>
                                            <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
                                        </div>
                                        <ul className="py-2">
                                            {isAdmin && <DropdownItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />}
                                            {isSeller && <DropdownItem to="/seller/dashboard" icon={LayoutDashboard} label="Dashboard" />}
                                            {isCustomer && <DropdownItem to="/customer/dashboard" icon={LayoutDashboard} label="My Dashboard" />}
                                            {isCustomer && <DropdownItem to="/customer/returns" icon={RotateCw} label="My Returns" />}

                                            <DropdownItem to="/profile" icon={User} label="Profile" />
                                            <DropdownItem icon={Settings} label="Settings" />
                                            <div className="border-t dark:border-gray-600 my-1"></div>
                                            <DropdownItem onClick={handleLogout} icon={LogOut} label="Sign out" isDanger />
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Guest Actions */}
                    {isGuest && (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-gray-700 hover:text-orange-600 dark:text-gray-300 font-medium text-sm">Login</Link>
                            <Link to="/register" className="text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 font-medium rounded-full text-xs px-4 py-2 dark:focus:ring-orange-800">
                                Join Us
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    >
                        <span className="sr-only">Open main menu</span>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Navbar Links (Middle / Collapsible) */}
                <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto md:order-1`}>
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                        {/* Guest/Customer Links */}
                        {(isGuest || isCustomer) && (
                            <>
                                <li>
                                    <Link to="/" className={`block py-2 pl-3 pr-4 rounded md:p-0 ${window.location.pathname === '/' ? 'text-orange-700 dark:text-orange-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'}`}>
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/products" className={`block py-2 pl-3 pr-4 rounded md:p-0 ${window.location.pathname === '/products' ? 'text-orange-700 dark:text-orange-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-700 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'}`}>
                                        Shop
                                    </Link>
                                </li>
                                {/* Become a Seller Button */}
                                <li>
                                    <Link
                                        to="/register/seller"
                                        className="block py-2 pl-3 pr-4 rounded md:p-0 text-orange-600 font-bold hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                                    >
                                        Become a Seller
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* Admin Links */}
                        {isAdmin && (
                            <>
                                <li><Link to="/admin/dashboard" className="block py-2 pl-3 pr-4 rounded text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-700 dark:text-white md:dark:hover:text-orange-500">Dashboard</Link></li>
                                <li><Link to="/admin/users" className="block py-2 pl-3 pr-4 rounded text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-700 dark:text-white md:dark:hover:text-orange-500">Users</Link></li>
                            </>
                        )}

                        {/* Seller Links */}
                        {isSeller && (
                            <>
                                <li><Link to="/seller/dashboard" className="block py-2 pl-3 pr-4 rounded text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-700 dark:text-white md:dark:hover:text-orange-500">Dashboard</Link></li>
                                <li><Link to="/profile" className="block py-2 pl-3 pr-4 rounded text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-700 dark:text-white md:dark:hover:text-orange-500">Profile</Link></li>
                                <li><span className="block py-2 pl-3 pr-4 text-gray-400 cursor-not-allowed">Analytics</span></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default CustomNavbar;
