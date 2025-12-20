import API from './api';

export const requestReturn = async (formData) => {
    // Expects FormData object due to potential file upload
    const res = await API.post('/returns', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const getSellerReturns = async () => {
    const res = await API.get('/seller/returns');
    return res.data;
};

export const processReturnRequest = async (id, status, remarks) => {
    // Using query params as per backend controller definition
    const res = await API.put(`/seller/returns/${id}`, null, {
        params: {
            status,
            remarks
        }
    });
    return res.data;
};
