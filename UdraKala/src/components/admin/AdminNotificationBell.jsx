import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUnreadNotificationCount } from '../../api/adminNotificationApi';

const AdminNotificationBell = () => {
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchCount = async () => {
        const count = await getUnreadNotificationCount();
        setUnreadCount(count);
    };

    useEffect(() => {
        fetchCount();
        const interval = setInterval(fetchCount, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <Link to="/admin/notifications" className="relative text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-white transition-colors">
            <Bell size={20} />
            {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white dark:border-slate-900">
                    {unreadCount > 99 ? '99+' : unreadCount}
                </span>
            )}
        </Link>
    );
};

export default AdminNotificationBell;
