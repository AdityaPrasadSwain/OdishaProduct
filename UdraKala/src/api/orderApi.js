import axios from './axios'; // Assuming configured axios instance

export const createOrder = async (orderData) => {
    const response = await axios.post('/orders', orderData);
    return response.data;
};

export const getMyOrders = async () => {
    const response = await axios.get('/orders/my-orders');
    return response.data;
};

export const getSellerOrders = async () => {
    const response = await axios.get('/orders/seller-orders');
    return response.data;
};

export const getOrderDetails = async (id) => {
    const response = await axios.get(`/orders/${id}`);
    return response.data;
};

export const updateOrderStatus = async (id, status, courierName, trackingId) => {
    const response = await axios.put(`/orders/${id}/status`, { status, courierName, trackingId });
    return response.data;
};

export const cancelOrder = async (id) => {
    const response = await axios.post(`/orders/${id}/cancel`);
    return response.data;
};

export const requestReturn = async (orderId, reason, imageUrl) => {
    const response = await axios.post('/returns', { orderId, reason, imageUrl });
    return response.data;
};

export const getSellerReturns = async () => {
    const response = await axios.get('/returns/seller');
    return response.data;
};

export const updateReturnStatus = async (id, status, comment) => {
    const response = await axios.put(`/returns/${id}/status`, { status, comment });
    return response.data;
};

export const sendSellerInvoice = async (orderId) => {
    const response = await axios.post(`/seller/orders/${orderId}/send-invoice`);
    return response.data;
};

export const downloadCustomerInvoice = async (orderId) => {
    const response = await axios.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob' // Important for PDF download
    });
    return response.data;
};
