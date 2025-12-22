import API from './api';

const startSession = async () => {
    const response = await API.post('/help/chat/start');
    return response.data;
};

const sendMessage = async (sessionId, message) => {
    const response = await API.post('/help/chat/send', { sessionId, message });
    return response.data;
};

const getHistory = async (sessionId) => {
    const response = await API.get(`/help/chat/history/${sessionId}`);
    return response.data;
};

const closeSession = async (sessionId) => {
    const response = await API.post('/help/chat/close', { sessionId });
    return response.data;
};

export default {
    startSession,
    sendMessage,
    getHistory,
    closeSession
};
