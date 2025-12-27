import API from './api';

// Create a new category with image
export const createCategory = async (formData) => {
    try {
        const response = await API.post('/categories', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// Get all categories (Admin)
export const getAllCategories = async () => {
    try {
        const response = await API.get('/categories');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// Get active categories (Customer)
export const getActiveCategories = async () => {
    try {
        const response = await API.get('/categories/active');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// Delete category
export const deleteCategory = async (id) => {
    try {
        const response = await API.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
