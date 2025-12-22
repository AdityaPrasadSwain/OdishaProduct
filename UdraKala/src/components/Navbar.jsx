import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, Package, BarChart, Settings, Heart, LayoutDashboard, Sun, Moon } from 'lucide-react';
import NotificationBell from './NotificationBell';
import AdminNotificationBell from './admin/AdminNotificationBell'; // Import Admin Bell
import udraKalaLogo from '../assets/logo.jpg';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';

const AdminNavbar = ({ logout }) => {
    const { theme, toggleTheme } = useTheme();
    return (
        <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/admin/dashboard" className="text-xl font-bold flex items-center gap-2">
                        <img src={udraKalaLogo} alt="Logo" className="h-8 w-8 rounded-full bg-white p-1" /> UdraKala <span className="text-lg font-normal opacity-80">| Admin Panel</span>
                    </Link>
                    <div className="flex items-center space-x-6">
                        <Link to="/admin/dashboard" className="hover:text-orange-400">Dashboard</Link>
                        <Link to="/profile" className="hover:text-orange-400">Profile</Link>
                        <button onClick={toggleTheme} className="text-gray-400 hover:text-yellow-400">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <AdminNotificationBell />
                        <button onClick={logout} className="flex items-center gap-2 hover:text-red-400"><LogOut size={16} /> Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const SellerNavbar = ({ user, logout }) => {
    const { theme, toggleTheme } = useTheme();
    return (
        <nav className="bg-white dark:bg-gray-900 border-b-4 border-orange-500 shadow-sm sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center gap-8">
                        <Link to="/seller/dashboard" className="text-2xl font-bold text-orange-800 dark:text-orange-400 flex items-center gap-2" style={{ fontFamily: 'serif' }}>
                            <img src={udraKalaLogo} alt="Logo" className="h-10 w-10 object-cover rounded-full" /> UdraKala <span className="text-sm font-sans font-normal text-gray-600 dark:text-gray-400">| Seller Central</span>
                        </Link>
                        <div className="hidden md:flex space-x-6">
                            <Link to="/seller/dashboard" className="font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">Dashboard</Link>
                            <Link to="/profile" className="font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">Profile</Link>
                            <Link to="#" className="font-medium text-gray-400 hover:text-orange-600 cursor-not-allowed">Analytics</Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{user.shopName}</span>
                        <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <NotificationBell />
                        <button onClick={logout} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const CustomerNavbar = ({ logout, cart, isOpen, setIsOpen }) => {
    const { theme, toggleTheme } = useTheme();
    return (
        <nav className="bg-orange-50/50 dark:bg-gray-900 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-orange-100 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/" className="text-3xl font-extrabold text-orange-800 dark:text-orange-400 flex items-center gap-2" style={{ fontFamily: 'serif' }}>
                        <img src={udraKalaLogo} alt="UdraKala" className="h-12 w-12 object-cover rounded-full bg-white dark:bg-transparent" /> UdraKala <span className="hidden sm:inline text-sm font-sans font-normal text-gray-500 dark:text-gray-400 tracking-widest uppercase">| Art of Odisha</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-800 dark:text-gray-200 hover:text-orange-700 dark:hover:text-orange-400 font-medium transition">Home</Link>
                        <Link to="/products" className="text-gray-800 dark:text-gray-200 hover:text-orange-700 dark:hover:text-orange-400 font-medium transition">Shop</Link>

                        <div className="flex items-center gap-6 pl-6 border-l border-orange-200 dark:border-gray-700">
                            <button onClick={toggleTheme} className="text-gray-800 dark:text-gray-200 hover:text-orange-700 dark:hover:text-orange-400">
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            <Link to="/profile" className="text-gray-800 dark:text-gray-200 hover:text-orange-700 dark:hover:text-orange-400 font-medium" title="Profile">
                                <User size={20} />
                            </Link>
                            <Link to="/customer/dashboard" className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-orange-700 dark:hover:text-orange-400 font-medium">
                                Dashboard
                            </Link>
                            <NotificationBell />
                            <Link to="/wishlist" className="text-gray-800 dark:text-gray-200 hover:text-orange-700 dark:hover:text-orange-400 font-medium relative">
                                <Heart size={22} />
                            </Link>
                            <Link to="/cart" className="text-gray-800 dark:text-gray-200 hover:text-orange-700 dark:hover:text-orange-400 relative">
                                <ShoppingCart size={24} />
                                {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cart.reduce((t, i) => t + i.quantity, 0)}</span>}
                            </Link>
                            <button onClick={logout} className="text-gray-500 hover:text-red-600"><LogOut size={20} /></button>
                        </div>
                    </div>

                    {/* Mobile Icons */}
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={toggleTheme} className="text-gray-800 dark:text-gray-200">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <Link to="/wishlist" className="text-gray-800 dark:text-gray-200 relative">
                            <Heart size={24} />
                        </Link>
                        <Link to="/cart" className="text-gray-800 dark:text-gray-200 relative">
                            <ShoppingCart size={24} />
                            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cart.reduce((t, i) => t + i.quantity, 0)}</span>}
                        </Link>
                        <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4 space-y-3">
                    <Link to="/profile" className="block text-gray-800 dark:text-gray-200 font-bold" onClick={() => setIsOpen(false)}>My Profile</Link>
                    <Link to="/customer/dashboard" className="block text-gray-800 dark:text-gray-200 font-bold" onClick={() => setIsOpen(false)}>My Dashboard</Link>
                    <Link to="/products" className="block text-gray-800 dark:text-gray-200" onClick={() => setIsOpen(false)}>Shop</Link>
                    <button onClick={logout} className="block text-red-600 w-full text-left">Logout</button>
                </div>
            )}
        </nav>
    );
};

const GuestNavbar = ({ cart, isOpen, setIsOpen }) => {
    const { theme, toggleTheme } = useTheme();
    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/" className="text-3xl font-extrabold text-orange-700 dark:text-orange-500 flex items-center gap-2" style={{ fontFamily: 'serif' }}>
                        <img src={udraKalaLogo} alt="UdraKala" className="h-12 w-12 object-cover rounded-full" /> UdraKala
                    </Link>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="font-medium text-gray-800 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400">Home</Link>
                        <Link to="/products" className="font-medium text-gray-800 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400">Collection</Link>
                        <div className="flex items-center gap-4 ml-4">
                            <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400">
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium">Login</Link>
                            <Link to="/register" className="bg-orange-700 text-white px-6 py-2 rounded-full hover:bg-orange-800 transition font-medium shadow-lg hover:shadow-orange-200">Join Us</Link>
                        </div>
                        <Link to="/wishlist" className="text-gray-800 dark:text-gray-200 hover:text-orange-700 dark:hover:text-orange-400 relative ml-4">
                            <Heart size={22} />
                        </Link>
                        <Link to="/cart" className="text-gray-800 dark:text-gray-200 hover:text-orange-700 dark:hover:text-orange-400 relative ml-4">
                            <ShoppingCart size={24} />
                            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cart.reduce((t, i) => t + i.quantity, 0)}</span>}
                        </Link>
                    </div>
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={toggleTheme} className="text-gray-800 dark:text-gray-200">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <Link to="/cart" className="text-gray-800 dark:text-gray-200 relative">
                            <ShoppingCart size={24} />
                            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cart.reduce((t, i) => t + i.quantity, 0)}</span>}
                        </Link>
                        <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
                    </div>
                </div>
                {isOpen && (
                    <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4 space-y-4">
                        <Link to="/login" className="block w-full text-center py-2 border dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg" onClick={() => setIsOpen(false)}>Login</Link>
                        <Link to="/register" className="block w-full text-center py-2 bg-orange-700 text-white rounded-lg" onClick={() => setIsOpen(false)}>Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout, loading } = useAuth();
    const { cart } = useData();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Prevent FOUC (Flash of Unauthenticated Content)
    if (loading) return null;

    if (!user) return <GuestNavbar cart={cart} isOpen={isOpen} setIsOpen={setIsOpen} />;

    // Check roles array for specific permissions
    if (user.roles?.includes('ROLE_ADMIN')) return <AdminNavbar logout={handleLogout} />;
    if (user.roles?.includes('ROLE_SELLER')) return <SellerNavbar user={user} logout={handleLogout} />;
    if (user.roles?.includes('ROLE_CUSTOMER')) return <CustomerNavbar logout={handleLogout} cart={cart} isOpen={isOpen} setIsOpen={setIsOpen} />;

    return <GuestNavbar cart={cart} isOpen={isOpen} setIsOpen={setIsOpen} />;
};

export default Navbar;
