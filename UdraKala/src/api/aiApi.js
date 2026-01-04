import axios from './axios';

export const generateProductDescription = async (data) => {
    try {
        const response = await axios.post('/ai/product/description', data);
        return response.data;
    } catch (error) {
        console.error("Error generating product description:", error);
        throw error;
    }
};

export const generateReelScript = async (data) => {
    try {
        const response = await axios.post('/ai/reels/script', data);
        return response.data;
    } catch (error) {
        console.error("Error generating reel script:", error);
        throw error;
    }
};

export const generateCommentReply = async (data) => {
    try {
        const response = await axios.post('/ai/comment/reply', data);
        return response.data;
    } catch (error) {
        console.error("Error generating comment reply:", error);
        throw error;
    }
};

export const categorizeProduct = async (data) => {
    try {
        const response = await axios.post('/ai/product/categorize', data);
        return response.data;
    } catch (error) {
        console.error("Error categorizing product:", error);
        throw error;
    }
};
