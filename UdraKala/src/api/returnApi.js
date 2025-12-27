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
    // Mapping action string to boolean for backend DTO
    // Note: This matches ReturnRequestDTO.SellerDecision (boolean approved)
    const isApproved = action === 'APPROVED';
    const decisionData = {
        approved: isApproved,
        remarks: remarks
    };
    return await updateSellerDecision(id, decisionData);
};
