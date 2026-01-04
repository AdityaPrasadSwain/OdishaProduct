import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/seller/payouts` : 'http://localhost:8086/api/seller/payouts';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

export const getBankDetails = async () => {
    try {
        const response = await axios.get(`${API_URL}/bank-details`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateBankDetails = async (details) => {
    try {
        const response = await axios.post(`${API_URL}/bank-details`, details, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getWalletOverview = async () => {
    try {
        const response = await axios.get(`${API_URL}/wallet`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const initiatePayout = async () => {
    // Ideally this endpoint should exist in backend as well, but for now we follow the plan
    // If backend endpoint for initiate payout is not exposed in controller, we might need to add it.
    // Checking controller... SellerPayoutController doesn't have initiatePayout endpoint exposed yet!
    // I missed that in the backend steps.
    // I will add the frontend function now and fix the backend controller in the next step.
    try {
        const response = await axios.post(`${API_URL}/initiate`, {}, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
