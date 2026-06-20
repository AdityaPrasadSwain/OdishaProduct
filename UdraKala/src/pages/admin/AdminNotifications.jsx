import { useState, useEffect } from 'react';
import { getAdminNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../api/adminNotificationApi';
import { Bell, CheckCheck, Filter, User, Package, RefreshCw, AlertTriangle, Info } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getAdminNotifications(0, 50); // Fetch first 50
            setNotifications(data.content || []);
        } catch (error) {
            console.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'All marked as read',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            await markNotificationAsRead(notification.id);
            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
        }

        // Redirect logic based on type
        switch (notification.type) {
            case 'SELLER_REGISTERED':
                navigate('/admin/sellers'); // Or specific seller detail page
                break;
            case 'ORDER_CREATED':
            case 'HIGH_VALUE_ORDER':
                // Assuming admin has an order view (if not, go to orders list)
                navigate('/admin/orders');
                break;
            case 'RETURN_REQUEST':
                navigate('/admin/returns'); // Or specific return page if implemented
                break;
            default:
                break;
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'ALL') return true;
        if (filter === 'UNREAD') return !n.read;
        if (filter === 'SELLER') return ['SELLER_REGISTERED', 'SELLER_APPROVED'].includes(n.type);
        if (filter === 'ORDER') return ['ORDER_CREATED', 'HIGH_VALUE_ORDER'].includes(n.type);
        if (filter === 'RETURN') return ['RETURN_REQUEST', 'REFUND_REQUEST'].includes(n.type);
        return true;
    });

    const getIcon = (type) => {
        switch (type) {
            case 'SELLER_REGISTERED': return <User className="text-primary" />;
            case 'SELLER_APPROVED': return <User className="text-status-success" />;
            case 'ORDER_CREATED': return <Package className="text-primary" />;
            case 'HIGH_VALUE_ORDER': return <AlertTriangle className="text-status-error" />;
            case 'RETURN_REQUEST': return <RefreshCw className="text-purple-500" />;
            default: return <Info className="text-text-secondary" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'border-l-4 border-red-500';
            case 'MEDIUM': return 'border-l-4 border-primary';
            default: return 'border-l-4 border-green-400'; // Low
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.round(diffMs / 60000);
        const diffHours = Math.round(diffMs / 3600000);
        const diffDays = Math.round(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    };

    return (
        <div className="max-w-4xl mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary dark:text-text-onDark flex items-center gap-2">
                        <Bell className="fill-current text-primary" /> System Notifications
                    </h1>
                    <p className="text-text-secondary text-sm">Real-time alerts for admin actions</p>
                </div>
                <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-2 px-4 py-2 bg-bg-surface dark:bg-bg-dark border border-border dark:border-border rounded-lg text-sm hover:bg-bg-page dark:hover:bg-bg-dark transition-colors shadow-sm"
                >
                    <CheckCheck size={16} className="text-status-success" /> Mark all read
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                {[
                    { id: 'ALL', label: 'All Alerts' },
                    { id: 'UNREAD', label: 'Unread' },
                    { id: 'SELLER', label: 'Sellers' },
                    { id: 'ORDER', label: 'Orders' },
                    { id: 'RETURN', label: 'Returns' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                            ${filter === tab.id
                                ? 'bg-primary text-text-onDark shadow-md'
                                : 'bg-bg-band dark:bg-bg-dark text-text-secondary dark:text-text-secondary hover:bg-bg-band'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Notification List */}
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-12 text-text-secondary">Loading notifications...</div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center">
                        <div className="bg-bg-band dark:bg-bg-dark p-4 rounded-full mb-4">
                            <Bell size={32} className="text-text-secondary" />
                        </div>
                        <h3 className="text-lg font-medium text-text-primary dark:text-text-onDark">All caught up!</h3>
                        <p className="text-text-secondary">No notifications to display.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredNotifications.map((notification) => (
                            <Motion.div
                                key={notification.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                onClick={() => handleNotificationClick(notification)}
                                className={`relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all hover:bg-bg-page dark:hover:bg-bg-dark/50 
                                    ${!notification.read ? 'bg-bg-surface dark:bg-bg-dark shadow-sm' : 'bg-bg-page/50 dark:bg-bg-dark/50 text-text-secondary'}
                                    ${getPriorityColor(notification.priority)} border border-border dark:border-border`}
                            >
                                <div className={`p-2 rounded-lg ${!notification.read ? 'bg-bg-band dark:bg-bg-dark' : 'bg-transparent'}`}>
                                    {getIcon(notification.type)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`text-sm font-semibold mb-1 ${!notification.read ? 'text-text-primary dark:text-text-onDark' : 'text-text-secondary dark:text-text-secondary'}`}>
                                            {notification.title}
                                        </h4>
                                        <span className="text-xs text-text-secondary whitespace-nowrap ml-2">
                                            {formatDate(notification.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-secondary dark:text-text-secondary line-clamp-2">
                                        {notification.message}
                                    </p>
                                </div>

                                {!notification.read && (
                                    <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary animate-pulse" />
                                )}
                            </Motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default AdminNotifications;
