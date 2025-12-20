import axios from './axios';

/**
 * Wishlist API
 */
export const wishlistApi = {
    /**
     * Get all wishlist products for the logged-in user
     */
    getWishlist: async () => {
        const response = await axios.get('/customer/wishlist');
        return response.data;
    },

    /**
     * Toggle a product in/out of the blacklist
     */
    toggleWishlist: async (productId) => {
        const response = await axios.post(`/customer/wishlist/${productId}`);
        return response.data;
    },

    /**
     * Remove a product from the blacklist explicitly
     */
    removeFromWishlist: async (productId) => {
        const response = await axios.delete(`/customer/wishlist/${productId}`);
        return response.data;
    }
};

export default wishlistApi;
