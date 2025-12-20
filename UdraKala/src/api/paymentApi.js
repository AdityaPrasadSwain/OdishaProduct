import api from './axios';

export const getStripeConfig = async () => {
    const response = await api.get('/payments/config');
    return response.data;
};

export const createPaymentIntent = async (amount, currency, metadata) => {
    const response = await api.post('/payments/create-payment-intent', {
        amount,
        currency,
        ...metadata
    });
    return response.data;
};
