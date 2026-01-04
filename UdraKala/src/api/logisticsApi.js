import API from './axios';

const logisticsApi = {
    getDeliveryAgents: async () => {
        const response = await API.get('/admin/logistics/agents');
        return response.data;
    },

    assignAgent: async (shipmentId, agentId) => {
        const response = await API.post(`/admin/logistics/shipments/${shipmentId}/assign`, null, {
            params: { agentId }
        });
        return response.data;
    },

    dispatchShipment: async (shipmentId) => {
        const response = await API.post(`/admin/logistics/shipments/${shipmentId}/dispatch`);
        return response.data;
    }
};

export default logisticsApi;
