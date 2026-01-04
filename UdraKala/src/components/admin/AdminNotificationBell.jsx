import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUnreadNotificationCount, getAdminNotifications } from '../../api/adminNotificationApi';
import Swal from 'sweetalert2';

const AdminNotificationBell = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const lastNotificationIdRef = useRef(null);

    const fetchData = async () => {
        try {
            const count = await getUnreadNotificationCount();
            setUnreadCount(count);

            // Fetch latest notification to check for new alerts
            const data = await getAdminNotifications(0, 1);
            if (data && data.content && data.content.length > 0) {
                const latest = data.content[0];

                // If we have a new notification that is unread
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
            console.error("Error polling notifications:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30 seconds
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
