import API from './api';

// No need for hardcoded URL or manual token headers, API instance handles it.

export const createReturnRequest = async (requestData) => {
    const response = await API.post('/returns', requestData);
    return response.data;
};

export const getCustomerReturns = async () => {
    const response = await API.get('/returns/customer');
    return response.data;
};

export const getSellerReturns = async () => {
    const response = await API.get('/returns/seller');
    return response.data;
};

export const getAdminReturns = async () => {
    const response = await API.get('/returns/admin');
    return response.data;
};

export const getReturnRequestById = async (id) => {
    const response = await API.get(`/returns/${id}`);
    return response.data;
};

export const updateSellerDecision = async (id, decisionData) => {
    const response = await API.put(`/returns/${id}/seller-decision`, decisionData);
    return response.data;
};

export const updateAdminDecision = async (id, decisionData) => {
    const response = await API.put(`/returns/${id}/admin-decision`, decisionData);
    return response.data;
};

export const cancelReturnRequest = async (id) => {
    await API.delete(`/returns/${id}`);
};

export const processReturnRequest = async (id, action, remarks) => {
    // Map Frontend Action strings to Backend DTO
    let decisionData = { remarks: remarks };

    if (action === 'APPROVED') {
        decisionData.approved = true;
    } else if (action === 'REJECTED') {
        decisionData.approved = false;
    } else {
        // Handle explicit status updates
        // SellerDashboard passes 'PICKED_UP' for button, we map to Enum 'PICKUP_SCHEDULED'
        if (action === 'PICKED_UP') {
            decisionData.status = 'PICKUP_SCHEDULED';
        } else if (action === 'COMPLETED') {
            decisionData.status = 'COMPLETED';
        } else {
            // Fallback
            decisionData.status = action;
        }
    }

    return await updateSellerDecision(id, decisionData);
};
