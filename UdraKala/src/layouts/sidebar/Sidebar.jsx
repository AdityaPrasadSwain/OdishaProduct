import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { splitRoleItems } from './SidebarItems';
import { Link, useLocation } from 'react-router-dom';
import udraKalaLogo from '../../assets/logo.jpg';
import { LogOut } from 'lucide-react';

const Sidebar = ({ isMobile, setMobileSidebarOpen }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Determine role-based items. Assuming user.roles is an array.
    // We pick the primary role for the dashboard view.
    const primaryRole = user?.roles?.find(r => ['ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_CUSTOMER'].includes(r)) || 'ROLE_CUSTOMER';
    const items = splitRoleItems(primaryRole);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark border-r border-border dark:border-dark-light transition-transform duration-300 ease-in-out
      ${isMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:static lg:inset-0'}
    `}>
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 h-16 border-b border-border dark:border-dark-light">
                <img src={udraKalaLogo} alt="Logo" className="h-8 w-8 rounded-full" />
                <span className="text-xl font-bold font-sans text-dark dark:text-white">UdraKala</span>
            </div>

            {/* Nav Items */}
            <nav className="p-4 space-y-1 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
                {items.map((item) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.id}
                            to={item.href}
                            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(false)}
                            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                ${isActive
                                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                                    : 'text-dark dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-light hover:text-primary'}
              `}
                        >
                            <Icon size={20} />
                            {item.title}
                        </Link>
                    );
                })}

                {/* Logout at bottom */}
                <div className="pt-4 mt-4 border-t border-border dark:border-dark-light">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-danger hover:bg-danger-light transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
