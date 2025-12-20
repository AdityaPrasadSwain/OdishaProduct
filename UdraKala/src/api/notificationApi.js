import API from './api';

export const getUserNotifications = async () => {
    try {
        const response = await API.get('/notifications');
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

export const getUnreadCount = async () => {
    try {
        const response = await API.get('/notifications/unread-count');
        return response.data;
    } catch (error) {
        console.error("Error fetching unread count:", error);
        return 0;
    }
};

export const markAsRead = async (id) => {
    try {
        await API.put(`/notifications/${id}/read`);
        return true;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return false;
    }
};

export const markAllAsRead = async () => {
    try {
        await API.put('/notifications/read-all');
        return true;
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return false;
    }
};
