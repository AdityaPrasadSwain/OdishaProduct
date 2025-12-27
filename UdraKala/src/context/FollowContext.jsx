import { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/api';
import { useAuth } from './AuthContext';

const FollowContext = createContext(null);

export const FollowProvider = ({ children }) => {
    const { user } = useAuth();
    const [followedSellers, setFollowedSellers] = useState(new Set());
    const [loading, setLoading] = useState(false);

    // Fetch followed sellers when user logs in
    useEffect(() => {
        if (user) {
            fetchFollowedSellers();
        } else {
            setFollowedSellers(new Set());
        }
    }, [user]);

    const fetchFollowedSellers = async () => {
        setLoading(true);
        try {
            const res = await API.get('/follow/sellers');
            // Assuming res.data is an array of UUID strings
            setFollowedSellers(new Set(res.data));
        } catch (error) {
            console.error("Failed to fetch followed sellers", error);
        } finally {
            setLoading(false);
        }
    };

    const follow = async (sellerId, sellerName, source, sourceReelId) => {
        // Optimistic UI Update
        setFollowedSellers(prev => new Set(prev).add(sellerId));

        try {
            // Build query params if source is provided
            let url = `/follow/${sellerId}`;
            if (source) {
                url += `?source=${source}`;
                if (sourceReelId) {
                    url += `&reelId=${sourceReelId}`;
                }
            }
            // Use the seller-interaction controller endpoint which is /api/sellers/{id}/follow
            // Wait, api.js base might be /api/customer? No, usually /api.
            // Check FollowContext original: `await API.post(/follow/${sellerId})`
            // But controller says: `@PostMapping("/sellers/{id}/follow")`
            // Let's assume API base url handling is consistent. 
            // Previous code used `/follow/${sellerId}`. 
            // If that worked, then there's a redirect or I should stick to it, 
            // BUT ensure I append params correctly.

            // Actually, the new controller method signature I made is:
            // @PostMapping("/sellers/{id}/follow") 
            // So I should use `/sellers/${sellerId}/follow` to be safe/correct per my backend change.
            // But I must be careful not to break existing calls.
            // The original FollowContext used `/follow/${sellerId}`? 
            // Step 939 view shows: `await API.post(/follow/${sellerId});`
            // Is there a `FollowController`? Or was it `ReelInteractionController` mapped to `/api`?
            // `ReelInteractionController` is `@RequestMapping("/api")`.
            // Method is `@PostMapping("/sellers/{id}/follow")`.
            // So the correct URL is `/sellers/${sellerId}/follow`.
            // The existing `FollowContext` using `/follow/${sellerId}` might have been using a different controller?
            // Or I mapped it differently. 
            // Let's switch to the explicit path I know exists: `/sellers/${sellerId}/follow`.

            await API.post(`/sellers/${sellerId}/follow`, null, {
                params: { source, reelId: sourceReelId }
            });
        } catch (error) {
            console.error("Failed to follow seller", error);
            // Revert on failure
            setFollowedSellers(prev => {
                const next = new Set(prev);
                next.delete(sellerId);
                return next;
            });
            throw error;
        }
    };

    const unfollow = async (sellerId) => {
        // Optimistic UI Update
        setFollowedSellers(prev => {
            const next = new Set(prev);
            next.delete(sellerId);
            return next;
        });

        try {
            await API.delete(`/follow/${sellerId}`);
        } catch (error) {
            console.error("Failed to unfollow seller", error);
            // Revert on failure
            setFollowedSellers(prev => new Set(prev).add(sellerId));
            throw error;
        }
    };

    const isFollowing = (sellerId) => {
        return followedSellers.has(sellerId);
    };

    return (
        <FollowContext.Provider value={{ followedSellers, follow, unfollow, isFollowing, loading }}>
            {children}
        </FollowContext.Provider>
    );
};

export const useFollow = () => useContext(FollowContext);
