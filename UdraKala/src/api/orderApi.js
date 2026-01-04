import axios from './axios'; // Assuming configured axios instance

export const createOrder = async (orderData) => {
    const response = await axios.post('/orders', orderData);
    return response.data;
};

export const getMyOrders = async () => {
    const response = await axios.get('/orders/my-orders');
    return response.data;
};

// New Filtered Orders API
export const getCustomerOrders = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.range && filters.range !== 'ALL') params.append('range', filters.range);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);

    const response = await axios.get(`/orders/customer?${params.toString()}`);
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

export const acceptOrder = async (orderId) => {
    const response = await axios.post(`/seller/orders/${orderId}/accept`);
    return response.data;
};

export const rejectOrder = async (orderId) => {
    const response = await axios.post(`/seller/orders/${orderId}/reject`);
    return response.data;
};

export const downloadShippingLabel = async (orderId) => {
    const response = await axios.get(`/seller/orders/${orderId}/label`, {
        responseType: 'blob'
    });
    return response.data;
};

export const markPacked = async (orderId) => {
    const response = await axios.post(`/seller/orders/${orderId}/pack`);
    return response.data;
};
export const downloadBulkShippingLabels = async (orderIds) => {
    const response = await axios.post('/seller/orders/bulk-labels', orderIds, {
        responseType: 'blob'
    });
    return response.data;
};

export const uploadPackingVideo = async (orderId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`/seller/packaging/upload/${orderId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getPackingVideo = async (orderId) => {
    const response = await axios.get(`/customer/order/${orderId}/packaging-video`, {
        skipGlobalError: true
    });
    return response.data;
};


export const requestDeliveryProof = async (orderId, reason) => {
    const response = await axios.post('/seller/proof-requests', { orderId, reason });
    return response.data;
};

export const getDeliveryProof = async (shipmentId) => {
    const response = await axios.get(`/seller/delivery-proof/${shipmentId}`);
    return response.data;
};

export const getSellerProofRequests = async () => {
    const response = await axios.get('/seller/proof-requests');
    return response.data;
};

const orderApi = {
    createOrder,
    getMyOrders,
    getCustomerOrders,
    getSellerOrders,
    getOrderDetails,
    updateOrderStatus,
    cancelOrder,
    requestReturn,
    getSellerReturns,
    updateReturnStatus,
    sendSellerInvoice,
    downloadCustomerInvoice,
    acceptOrder,
    rejectOrder,
    downloadShippingLabel,
    markPacked,
    downloadBulkShippingLabels,
    uploadPackingVideo,
    getPackingVideo,
    requestDeliveryProof,
    getDeliveryProof,
    getSellerProofRequests
};

export default orderApi;
