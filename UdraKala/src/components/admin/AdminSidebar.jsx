import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, Package, Grid, Ticket, RotateCcw, Settings, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, section: 'STORE' },
        { id: 'sellers', label: 'Sellers', icon: Users, section: 'MANAGEMENT' },
        { id: 'products', label: 'Products', icon: Package, section: 'MANAGEMENT' },
        { id: 'categories', label: 'Categories', icon: Grid, section: 'MANAGEMENT' },
        { id: 'coupons', label: 'Coupons', icon: Ticket, section: 'OPERATIONS' },
        { id: 'returns', label: 'Returns', icon: RotateCcw, section: 'OPERATIONS' },
        { id: 'features', label: 'Features', icon: Settings, section: 'SYSTEM' },
    ];

    // Group tabs by section
    const groupedTabs = tabs.reduce((acc, tab) => {
        if (!acc[tab.section]) acc[tab.section] = [];
        acc[tab.section].push(tab);
        return acc;
    }, {});

    return (
        <div className="w-64 h-full bg-bg-surface dark:bg-bg-dark border-r border-border dark:border-white/5 flex flex-col flex-shrink-0">
            {/* Brand / Logo */}
            <div className="h-16 flex items-center px-6 border-b border-border dark:border-white/5">
                <Link to="/" className="flex items-center gap-2">
                    <ShieldCheck className="text-primary" size={24} />
                    <span className="font-serif font-bold text-xl tracking-tight text-text-primary dark:text-text-onDark">UdraKala</span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-hide space-y-8">
                {Object.entries(groupedTabs).map(([section, sectionTabs]) => (
                    <div key={section} className="space-y-2">
                        <h4 className="text-xs font-semibold text-text-secondary dark:text-gray-500 tracking-wider px-2">
                            {section}
                        </h4>
                        <nav className="space-y-1">
                            {sectionTabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                            ${isActive
                                                ? 'bg-indigo-50 text-primary dark:bg-primary/10 dark:text-primary'
                                                : 'text-text-secondary hover:text-text-primary dark:text-text-secondary dark:hover:text-text-onDark hover:bg-gray-50 dark:hover:bg-bg-surface/5'
                                            }`}
                                    >
                                        <Icon size={18} className={isActive ? 'text-primary' : 'text-text-secondary dark:text-text-secondary group-hover:text-primary'} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </div>

            {/* Bottom Profile / Info */}
            <div className="p-4 border-t border-border dark:border-white/5">
                <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-bg-surface/5 cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        A
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary dark:text-text-onDark truncate">System Admin</p>
                        <p className="text-xs text-text-secondary truncate">admin@udrakala.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
