import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import wishlistApi from '../api/wishlistApi';
import Swal from 'sweetalert2';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, authenticated } = useAuth();

    // Fetch wishlist when user logs in
    useEffect(() => {
        if (authenticated && user?.roles?.includes('ROLE_CUSTOMER')) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
        }
    }, [authenticated, user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const data = await wishlistApi.getWishlist();
            setWishlistItems(data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = async (product) => {
        if (!authenticated) {
            Swal.fire({
                title: 'Sign In Required',
                text: 'Please sign in to add items to your wishlist.',
                icon: 'info',
                confirmButtonColor: '#ea580c'
            });
            return;
        }

        if (!user?.roles?.includes('ROLE_CUSTOMER')) {
            Swal.fire({
                title: 'Customer Only',
                text: 'Only customers can manage wishlists.',
                icon: 'warning',
                confirmButtonColor: '#ea580c'
            });
            return;
        }

        const isItemInWishlist = wishlistItems.some(item => item.id === product.id);

        try {
            const updatedWishlist = await wishlistApi.toggleWishlist(product.id);
            setWishlistItems(updatedWishlist);

            if (isItemInWishlist) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Removed from wishlist',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
            } else {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Added to wishlist',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                confirmButtonColor: '#ea580c'
            });
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await wishlistApi.removeFromWishlist(productId);
            setWishlistItems(prev => prev.filter(item => item.id !== productId));
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Removed from wishlist',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, loading, toggleWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
