import API from './api';

export const getAdminNotifications = async (page = 0, size = 20) => {
    try {
        const response = await API.get(`/admin/notifications?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching admin notifications:", error);
        throw error;
    }
};

export const getUnreadNotificationCount = async () => {
    try {
        const response = await API.get('/admin/notifications/unread-count');
        return response.data.count;
    } catch (error) {
        console.error("Error fetching unread count:", error);
        return 0;
    }
};

export const markNotificationAsRead = async (id) => {
    try {
        const response = await API.put(`/admin/notifications/${id}/read`);
        return response.data;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};

export const markAllNotificationsAsRead = async () => {
    try {
        const response = await API.put('/admin/notifications/read-all');
        return response.data;
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
    }
};
