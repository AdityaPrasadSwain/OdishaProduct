import axios from 'axios';

const API_URL = 'http://localhost:8085/api/payments';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const initiatePayment = async (orderId, method) => {
    const response = await axios.post(`${API_URL}/initiate`, { orderId, method }, getAuthHeader());
    return response.data;
};

export const verifyPayment = async (orderId, paymentId, orderRef, signature) => {
    const response = await axios.post(`${API_URL}/verify`, { orderId, paymentId, orderRef, signature }, getAuthHeader());
    return response.data;
};
