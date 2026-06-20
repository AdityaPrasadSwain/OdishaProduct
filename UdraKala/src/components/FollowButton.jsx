import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { UserPlus, UserCheck } from 'lucide-react';
import { useFollow } from '../context/FollowContext';
import { useAuth } from '../context/AuthContext';

const FollowButton = (props) => {
    const { sellerId, sellerName } = props;
    const { isFollowing, follow, unfollow } = useFollow();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [hover, setHover] = useState(false);

    const following = isFollowing(sellerId);

    const handleFollowToggle = async (e) => {
        e.preventDefault(); // Prevent navigation if inside a link
        e.stopPropagation();

        if (!user) {
            Swal.fire({
                icon: 'warning',
                title: 'Login Required',
                text: 'Please login to follow sellers',
                confirmButtonColor: '#5747C7'
            });
            return;
        }

        const previousState = following;
        setLoading(true);

        try {
            if (previousState) {
                await unfollow(sellerId);
            } else {
                await follow(sellerId, sellerName, props.source, props.sourceReelId);
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
            console.error("Follow action failed", error);
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
                flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 z-10 relative
                ${following
                    ? 'bg-bg-band text-text-secondary hover:bg-red-50 hover:text-status-error dark:bg-bg-dark dark:text-text-secondary'
                    : 'bg-primary text-text-onDark hover:bg-primary-hover shadow-md shadow-blue-200 dark:shadow-none'}
            `}
        >
            {following ? (
                hover ? <><UserPlus size={16} className="rotate-45" /> Unfollow</> : <><UserCheck size={16} /> Following</>
            ) : (
                <><UserPlus size={16} /> Follow</>
            )}
        </button>
    );
};

export default FollowButton;
