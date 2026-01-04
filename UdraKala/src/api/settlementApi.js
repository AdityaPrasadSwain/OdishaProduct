import api from './axios';

// Admin Endpoints
export const getAllSettlements = async () => {
    const response = await api.get('/finance/settlement/admin/payouts');
    return response.data;
};

export const approvePayout = async (settlementId, transactionRef) => {
    const response = await api.post(`/finance/settlement/admin/payouts/${settlementId}/pay`, { transactionRef });
    return response.data;
};

export const holdSettlement = async (settlementId) => {
    const response = await api.post(`/finance/settlement/admin/payouts/${settlementId}/hold`);
    return response.data;
};

export const releaseSettlement = async (settlementId) => {
    const response = await api.post(`/finance/settlement/admin/payouts/${settlementId}/release`);
    return response.data;
};

export const getPlatformWallet = async () => {
    const response = await api.get('/finance/settlement/admin/platform-wallet');
    return response.data;
};

// Seller Endpoints
export const getMySettlements = async () => {
    const response = await api.get('/finance/settlement/seller/payouts');
    return response.data;
};
