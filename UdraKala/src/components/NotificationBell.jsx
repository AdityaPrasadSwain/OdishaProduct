import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Fetch Only on Mount & Interval
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return; // Don't fetch if not logged in

            const [listRes, countRes] = await Promise.all([
                api.get('/notifications'),
                api.get('/notifications/unread-count')
            ]);

            setNotifications(listRes.data);
            setUnreadCount(countRes.data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Poll every 1 min
        return () => clearInterval(interval);
    }, []);

    // Toggle Dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) fetchNotifications(); // Refresh on open
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Mark Single As Read
    const markAsRead = async (notification) => {
        // UI Optimistic Update
        if (!notification.isRead) {
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n =>
                n.id === notification.id ? { ...n, isRead: true } : n
            ));

            // API Call
            try {
                await api.patch(`/notifications/${notification.id}/read`);
            } catch (e) {
                console.error("Failed to mark read", e);
            }
        }

        // Navigation
        setIsOpen(false);

        // Navigation
        setIsOpen(false);

        // Seller Navigation Map
        switch (notification.type) {
            case 'ORDER':
                // Check role to differentiate (optional but good practice, assuming strict seller map for now as requested)
                navigate('/seller/orders');
                break;
            case 'FOLLOW':
                navigate('/seller/profile');
                break;
            case 'COMMENT':
            case 'REEL':
                // If specific reel, pass state, otherwise just list
                navigate('/seller/reels', { state: { reelId: notification.reelId } });
                break;
            case 'PAYOUT':
                navigate('/seller/payouts');
                break;
            case 'SYSTEM':
            default:
                // No redirect or potentially customer routes if needed
                if (localStorage.getItem('role') === 'CUSTOMER' && notification.type === 'ORDER') {
                    navigate('/customer/orders');
                }
                break;
        }
    };

    // Mark All As Read
    const markAllAsRead = async () => {
        try {
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            await api.put('/notifications/read-all');
        } catch (e) {
            console.error("Failed to mark all read", e);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 relative p-1"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-gray-900">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-gray-100 dark:border-gray-700 origin-top-right transform transition-all">
                    {/* Header */}
                    <div className="px-4 py-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center sticky top-0 z-10">
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold px-2 py-1 rounded hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <CheckCheck size={14} />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                {notifications.map((notification) => (
                                    <li
                                        key={notification.id}
                                        onClick={() => markAsRead(notification)}
                                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors border-l-4 ${!notification.isRead
                                            ? 'border-orange-500 bg-orange-50/30 dark:bg-orange-900/10'
                                            : 'border-transparent'
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Avatar / Icon Placeholder */}
                                            <div className="flex-shrink-0 mt-1">
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${!notification.isRead ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {(notification.senderName || "Sys").charAt(0).toUpperCase()}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <p className={`text-sm font-semibold mb-0.5 ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                                        }`}>
                                                        {notification.senderName || 'System'}
                                                    </p>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                        {new Date(notification.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <p className={`text-sm leading-snug ${!notification.isRead ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                    {notification.message}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <Bell className="h-12 w-12 text-gray-200 dark:text-gray-700 mb-3" />
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications yet</p>
                                <p className="text-xs text-gray-400 mt-1">We'll let you know when updates arrive.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
