import axios from './axios'; // Fixed import from local axios instance

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const shiprocketApi = {
    // Pickup Locations
    getPickupLocations: async () => {
        const response = await axios.get('/api/v1/shiprocket/pickup', getAuthHeaders());
        return response.data;
    },

    addPickupLocation: async (pickupData) => {
        const response = await axios.post('/api/v1/shiprocket/pickup', pickupData, getAuthHeaders());
        return response.data;
    },

    // Order Management
    syncOrder: async (orderId) => {
        const response = await axios.post(`/api/v1/shiprocket/orders/sync/${orderId}`, {}, getAuthHeaders());
        return response.data;
    },

    generateLabel: async (shipmentId) => {
        const response = await axios.post(`/api/v1/shiprocket/orders/label/${shipmentId}`, {}, getAuthHeaders());
        return response.data; // URL
    },

    trackOrder: async (awb) => {
        const response = await axios.get(`/api/v1/shiprocket/orders/track/${awb}`, getAuthHeaders());
        return response.data;
    }
};
