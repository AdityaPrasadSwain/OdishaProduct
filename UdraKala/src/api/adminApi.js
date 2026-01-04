import API from './axios';

const adminApi = {
    getStats: async () => {
        const response = await API.get('/admin/stats');
        return response.data;
    },
    getSellers: async () => {
        const response = await API.get('/admin/sellers');
        return response.data;
    },
    getCustomers: async () => {
        const response = await API.get('/admin/customers');
        return response.data;
    },
    approveSeller: async (id) => {
        const response = await API.put(`/admin/sellers/${id}/approve`);
        return response.data;
    },
    rejectSeller: async (id, reason) => {
        const response = await API.put(`/admin/sellers/${id}/reject`, null, { params: { reason } });
        return response.data;
    },
    blockSeller: async (id) => {
        const response = await API.put(`/admin/sellers/${id}/block`);
        return response.data;
    },
    unblockSeller: async (id) => {
        const response = await API.put(`/admin/sellers/${id}/unblock`);
        return response.data;
    },
    deleteSeller: async (id) => {
        const response = await API.delete(`/admin/sellers/${id}`);
        return response.data;
    },
    getAgents: async () => {
        const response = await API.get('/admin/agents');
        return response.data;
    },
    createAgent: async (agentData) => {
        const response = await API.post('/admin/agents', agentData);
        return response.data;
    }
};

export default adminApi;
