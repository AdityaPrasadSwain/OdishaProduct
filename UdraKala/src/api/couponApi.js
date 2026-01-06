import API from './axios';

const couponApi = {
    // User Operations
    applyCoupon: async (data, userId) => {
        const url = userId ? `/coupons/apply?userId=${userId}` : '/coupons/apply';
        const response = await API.post(url, data);
        return response.data;
    },

    checkUserUsage: async (userId, code) => {
        const response = await API.get(`/coupons/usage/user/${userId}?code=${code}`);
        return response.data;
    },

    // Admin Operations
    getAllCoupons: async () => {
        const response = await API.get('/admin/coupons');
        return response.data;
    },

    createCoupon: async (data) => {
        const response = await API.post('/admin/coupons', data);
        return response.data;
    },

    updateCoupon: async (id, data) => {
        const response = await API.put(`/admin/coupons/${id}`, data);
        return response.data;
    },

    deleteCoupon: async (id) => {
        await API.delete(`/admin/coupons/${id}`);
        return id;
    },

    toggleStatus: async (id) => {
        const response = await API.patch(`/admin/coupons/${id}/status`);
        return response.data;
    },

    getStats: async (id) => {
        const response = await API.get(`/admin/coupons/${id}/stats`);
        return response.data;
    }
};

export default couponApi;
