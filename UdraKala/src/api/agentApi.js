
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8086/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAgentOrders = async () => {
    const response = await axios.get(`${API_URL}/logistics/agent/orders`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getAgentSummary = async () => {
    const response = await axios.get(`${API_URL}/logistics/agent/earnings/summary`, {
        headers: getAuthHeader()
    });
    return response.data;
};

// Re-use logistics endpoints
export const updatePaymentStatus = async (shipmentId, status, txnRef) => {
    const response = await axios.post(`${API_URL}/logistics/shipments/${shipmentId}/payment/status`,
        { status, transactionRef: txnRef },
        { headers: getAuthHeader() }
    );
    return response.data;
};

export const markDeliveryFailed = async (shipmentId, reason) => {
    await axios.post(`${API_URL}/logistics/shipments/${shipmentId}/fail`,
        { reason },
        { headers: getAuthHeader() }
    );
};

// New Agent System Endpoints
const AGENT_API = `${API_URL}/logistics/agent/account`;

export const verifyBarcode = async (shipmentId, barcode) => {
    // Corrected Endpoint matching DeliveryAgentController
    const response = await axios.post(`${AGENT_API}/verify-barcode`,
        { shipmentId, barcode },
        { headers: getAuthHeader() }
    );
    return response.data;
};

export const sendOtp = async (shipmentId) => {
    const response = await axios.post(`${AGENT_API}/send-otp`,
        { shipmentId },
        { headers: getAuthHeader() }
    );
    return response.data;
};

export const verifyOtp = async (shipmentId, otp) => {
    const response = await axios.post(`${AGENT_API}/verify-otp`,
        { shipmentId, otp },
        { headers: getAuthHeader() }
    );
    return response.data;
};

export const getEarnings = async () => {
    const response = await axios.get(`${AGENT_API}/earnings`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getBankDetails = async () => {
    const response = await axios.get(`${AGENT_API}/bank-details`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const updateBankDetails = async (details) => {
    const response = await axios.post(`${AGENT_API}/bank-details`,
        details,
        { headers: getAuthHeader() }
    );
    return response.data;
};

// Upload Proof of Delivery
export const uploadProof = async (shipmentId, file) => {
    const formData = new FormData();
    formData.append('shipmentId', shipmentId);
    formData.append('file', file);
    const response = await axios.post(`${AGENT_API}/upload-proof`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...getAuthHeader()
        }
    });
    return response.data;
};

export const getAgentProofs = async () => {
    const response = await axios.get(`${AGENT_API}/delivery-proof`, {
        headers: getAuthHeader()
    });
    return response.data;
};
