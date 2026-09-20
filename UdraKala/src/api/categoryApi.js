import API from './api';

// Create a new category (JSON payload)
export const createCategory = async (categoryData) => {
    try {
        const response = await API.post('/categories', categoryData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update existing category
export const updateCategory = async (id, categoryData) => {
    try {
        const response = await API.put(`/categories/${id}`, categoryData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Reorder categories
export const reorderCategories = async (orderData) => {
    try {
        const response = await API.put('/categories/reorder', orderData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get all categories (Admin)
export const getAllCategories = async () => {
    try {
        const response = await API.get('/categories');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get active categories (Customer)
export const getActiveCategories = async () => {
    try {
        const response = await API.get('/categories/active');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete category
export const deleteCategory = async (id) => {
    try {
        const response = await API.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
