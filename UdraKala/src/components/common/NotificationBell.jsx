import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { getUserNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../../api/notificationApi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const lastNotificationIdRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const data = await getUserNotifications();
            setNotifications(data);
            const count = await getUnreadCount();
            setUnreadCount(count);

            if (data && data.length > 0) {
                const latest = data[0];
                // Check if it's a new notification and unread
                if (lastNotificationIdRef.current && latest.id !== lastNotificationIdRef.current && !latest.read) {
                    Swal.fire({
                        title: latest.title,
                        text: latest.message,
                        icon: 'info',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 5000,
                        timerProgressBar: true
                    });
                }
                lastNotificationIdRef.current = latest.id;
            }
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchNotifications();
        }
    };

    const handleMarkAsRead = async (id) => {
        await markAsRead(id);
        fetchNotifications();
    };

    const handleMarkAllRead = async () => {
        await markAllAsRead();
        fetchNotifications();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="p-2 rounded-full hover:bg-bg-band dark:hover:bg-bg-dark text-text-secondary dark:text-text-secondary relative transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-text-onDark transform translate-x-1/4 -translate-y-1/4 bg-status-error rounded-full border-2 border-white dark:border-border min-w-[20px]">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-bg-surface dark:bg-bg-dark rounded-lg shadow-xl border border-border dark:border-border z-50 overflow-hidden">
                    <div className="p-3 border-b border-border dark:border-border flex justify-between items-center">
                        <h3 className="font-semibold text-text-primary dark:text-text-onDark">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-primary hover:text-primary-dark font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-text-secondary dark:text-text-secondary text-sm">
                                No notifications
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                {notifications.map((notification) => (
                                    <li
                                        key={notification.id}
                                        className={`p-3 hover:bg-bg-page dark:hover:bg-bg-dark/50 transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-primary-hover/10' : ''}`}
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <p className="text-sm font-medium text-text-primary dark:text-text-onDark capitalize">
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-text-secondary dark:text-text-secondary mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-text-secondary mt-1">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <span className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-1"></span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
