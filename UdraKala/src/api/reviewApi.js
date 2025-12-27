import API from './api';

const reviewApi = {
    submitReview: async (reviewData, images) => {
        const formData = new FormData();
        formData.append('reviewData', new Blob([JSON.stringify(reviewData)], {
            type: 'application/json'
        }));

        if (images) {
            images.forEach((image) => {
                formData.append('images', image);
            });
        }

        // Use API instance - Content-Type header for multipart is usually auto-set by browser or needs partial hint
        // API interceptor adds Bearer token automatically
        const response = await API.post('/reviews', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    },

    editReview: async (reviewId, reviewData, images) => {
        const formData = new FormData();
        formData.append('reviewData', new Blob([JSON.stringify(reviewData)], {
            type: 'application/json'
        }));

        if (images && images.length > 0) {
            images.forEach((image) => {
                formData.append('images', image);
            });
        }

        const response = await API.put(`/reviews/${reviewId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    },

    getProductReviews: async (productId) => {
        const response = await API.get(`/reviews/product/${productId}`);
        return response.data;
    },

    checkEligibility: async (orderItemId) => {
        const response = await API.get(`/reviews/check-eligibility`, {
            params: { orderItemId }
        });
        return response.data;
    },

    checkProductEligibility: async (productId) => {
        const response = await API.get(`/reviews/eligibility/product/${productId}`);
        return response.data; // Returns orderItemId (UUID) or null/empty
    },

    getReviewByOrderItem: async (orderItemId) => {
        try {
            const response = await API.get(`/reviews/order-item/${orderItemId}`);
            return response.data;
        } catch (error) {
            return null;
        }
    }
};

export default reviewApi;
