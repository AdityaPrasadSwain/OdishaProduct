import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserPlus, UserCheck } from 'lucide-react';
import api from '../api/api';

const FollowButton = ({ sellerId, sellerName }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        if (sellerId) {
            checkFollowStatus();
        }
    }, [sellerId]);

    const checkFollowStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return; // Not logged in

            const response = await api.get(`/follow/${sellerId}/status`);
            setIsFollowing(response.data);
        } catch (error) {
            console.error("Failed to check follow status", error);
        }
    };

    const handleFollowToggle = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please login to follow sellers',
                confirmButtonColor: '#ea580c'
            });
            return;
        }

        // Optimistic UI Update
        const previousState = isFollowing;
        setIsFollowing(!isFollowing);
        setLoading(true);

        try {
            if (previousState) {
                // Unfollow
                await api.delete(`/follow/${sellerId}`);
            } else {
                // Follow
                await api.post(`/follow/${sellerId}`);
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: `You are now following ${sellerName || 'this seller'}`,
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        } catch (error) {
            // Revert on error
            setIsFollowing(previousState);
            console.error("Follow/Unfollow failed", error);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Action failed. Please try again.',
                showConfirmButton: false,
                timer: 2000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleFollowToggle}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            disabled={loading}
            className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300
                ${isFollowing
                    ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 dark:bg-gray-800 dark:text-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-none'}
            `}
        >
            {isFollowing ? (
                hover ? <><UserPlus size={16} className="rotate-45" /> Unfollow</> : <><UserCheck size={16} /> Following</>
            ) : (
                <><UserPlus size={16} /> Follow</>
            )}
        </button>
    );
};

export default FollowButton;
