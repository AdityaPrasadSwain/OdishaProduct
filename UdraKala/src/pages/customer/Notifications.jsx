import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Inbox } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../api/api';
import Swal from 'sweetalert2';
import { motion as Motion } from 'motion/react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (notification) => {
        if (notification.isRead) return;

        // Optimistic update
        setNotifications(prev => prev.map(n =>
            n.id === notification.id ? { ...n, isRead: true } : n
        ));

        try {
            await api.patch(`/notifications/${notification.id}/read`);
        } catch (e) {
            console.error("Failed to mark read", e);
        }
    };

    const markAllAsRead = async () => {
        try {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            await api.put('/notifications/read-all');
            Swal.fire({
                icon: 'success',
                title: 'All caught up!',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (e) {
            console.error("Failed to mark all read", e);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Bell className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary dark:text-text-onDark">Notifications</h1>
                        <p className="text-sm text-text-secondary">Stay updated with your orders and offers.</p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <Button variant="outline" onClick={markAllAsRead} className="flex items-center gap-2">
                        <CheckCheck size={16} /> Mark all as read
                    </Button>
                )}
            </div>

            <Card className="min-h-[500px] p-0 overflow-hidden bg-bg-surface dark:bg-[#121212] border-border dark:border-white/5 shadow-glass dark:shadow-glass-dark">
                {loading ? (
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse flex gap-4 p-4 rounded-xl bg-bg-page dark:bg-white/5">
                                <div className="w-12 h-12 bg-border dark:bg-white/10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-border dark:bg-white/10 rounded w-1/4" />
                                    <div className="h-4 bg-border dark:bg-white/10 rounded w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <Inbox size={48} className="text-primary opacity-80" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary dark:text-text-onDark">No notifications yet</h3>
                        <p className="text-text-secondary mt-2 max-w-sm">When you get updates about your orders, offers, or account, they'll show up here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/50 dark:divide-white/5">
                        {notifications.map((notification) => (
                            <Motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={notification.id}
                                onClick={() => markAsRead(notification)}
                                className={`p-6 flex gap-4 cursor-pointer transition-colors hover:bg-bg-page dark:hover:bg-white/5 border-l-4 ${
                                    !notification.isRead ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-transparent'
                                }`}
                            >
                                <div className="shrink-0 mt-1">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                                        !notification.isRead ? 'bg-primary text-text-onDark shadow-lg shadow-primary/30' : 'bg-bg-band dark:bg-white/10 text-text-secondary'
                                    }`}>
                                        {(notification.senderName || "U").charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-bold ${!notification.isRead ? 'text-text-primary dark:text-text-onDark' : 'text-text-secondary dark:text-text-secondary'}`}>
                                            {notification.senderName || 'System'}
                                        </h4>
                                        <span className="text-xs text-text-secondary font-medium whitespace-nowrap ml-4">
                                            {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className={`text-sm ${!notification.isRead ? 'text-text-primary dark:text-text-onDark font-medium' : 'text-text-secondary'}`}>
                                        {notification.message}
                                    </p>
                                </div>
                            </Motion.div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Notifications;
