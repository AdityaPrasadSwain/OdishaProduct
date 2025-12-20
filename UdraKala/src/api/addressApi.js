import API from './api';

export const getUserAddresses = async () => {
    const response = await API.get('/addresses');
    return response.data;
};

export const addAddress = async (addressData) => {
    const response = await API.post('/addresses', addressData);
    return response.data;
};

export const setDefaultAddress = async (addressId) => {
    // Backend expects PUT /api/addresses/{id}/default
    const response = await API.put(`/addresses/${addressId}/default`);
    return response.data;
};
