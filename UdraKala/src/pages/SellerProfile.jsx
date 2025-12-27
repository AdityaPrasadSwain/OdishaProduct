
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { motion } from 'motion/react';
import { ChevronLeft, Grid, Film, Tag, MessageCircle, MapPin } from 'lucide-react';
import FollowButton from '../components/FollowButton';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import WatchReels from './WatchReels';

const SellerProfile = () => {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('reels');
    const [selectedReelId, setSelectedReelId] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, [sellerId]);

    const fetchProfile = async () => {
        try {
            const res = await API.get(`/customer/sellers/${sellerId}/profile`);
            setProfile(res.data);
        } catch (error) {
            console.error("Failed to fetch seller profile", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <DashboardSkeleton />;

    if (!profile) return <div className="text-center py-20 text-gray-500 dark:text-white">Seller not found</div>;

    const ReelGrid = () => (
        <div className="grid grid-cols-3 gap-0.5 md:gap-4">
            {profile.reels && profile.reels.length > 0 ? (
                profile.reels.map((reel) => (
                    <div
                        key={reel.productId}
                        onClick={() => setSelectedReelId(reel.productId)}
                        className="relative aspect-[9/16] bg-gray-100 dark:bg-gray-900 cursor-pointer group overflow-hidden"
                    >
                        <img
                            src={reel.thumbnailUrl || reel.videoUrl.replace('.mp4', '.jpg')}
                            alt={reel.title}
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-bold drop-shadow-md">
                            <Film size={12} /> {reel.views || 0}
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-3 text-center py-10 text-gray-500">
                    No reels uploaded yet.
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen text-black dark:text-white pb-20 md:pb-0 font-sans transition-colors duration-300">
            {/* Header / Nav */}
            <div className="fixed top-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-40 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 h-14 transition-colors duration-300">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-black dark:text-white">
                    <ChevronLeft size={28} />
                </button>
                <div className="flex-1 font-bold text-lg truncate ml-2">
                    {profile.shopName}
                </div>
                {/* Optional: Add share/menu dots here */}
            </div>

            <div className="max-w-4xl mx-auto pt-20 px-4">
                {/* Profile Stats Section */}
                <div className="flex items-center gap-6 mb-6">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600">
                            <div className="w-full h-full rounded-full border-2 border-white dark:border-black overflow-hidden bg-gray-200 dark:bg-gray-800 transition-colors duration-300">
                                <img
                                    src={profile.profileImageUrl || `https://ui-avatars.com/api/?name=${profile.shopName}&background=random`}
                                    alt={profile.shopName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex-1 flex justify-around md:justify-start md:gap-12 text-center">
                        <div>
                            <div className="font-bold text-lg md:text-xl">{profile.postsCount}</div>
                            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Posts</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg md:text-xl">{profile.followersCount}</div>
                            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Followers</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg md:text-xl">{profile.followingCount}</div>
                            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Following</div>
                        </div>
                    </div>
                </div>

                {/* Bio & Actions */}
                <div className="mb-6 space-y-3">
                    <div>
                        <h1 className="font-bold text-lg">{profile.shopName}</h1>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{profile.bio || "Handloom seller from Odisha."}</p>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <FollowButton sellerId={profile.sellerId} sellerName={profile.shopName} />
                        </div>
                        <button className="flex-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-semibold py-1.5 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
                            Message
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-t border-gray-200 dark:border-gray-800 mb-0.5 sticky top-14 bg-white dark:bg-gray-900 z-30 transition-colors duration-300">
                    <button
                        onClick={() => setActiveTab('reels')}
                        className={`flex-1 py-3 flex justify-center items-center border-b-2 transition-colors ${activeTab === 'reels' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-500'}`}
                    >
                        <Grid size={24} />
                    </button>
                    <button
                        onClick={() => setActiveTab('tagged')}
                        className={`flex-1 py-3 flex justify-center items-center border-b-2 transition-colors ${activeTab === 'tagged' ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-500'}`}
                    >
                        <Tag size={24} />
                    </button>
                </div>

                {/* Content Grid */}
                <div className="min-h-[300px]">
                    {activeTab === 'reels' && <ReelGrid />}
                    {activeTab === 'tagged' && (
                        <div className="py-20 text-center text-gray-500 text-sm">
                            <Tag size={40} className="mx-auto mb-4 opacity-50" />
                            No tagged posts yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Full Screen Viewer Wrapper */}
            {selectedReelId && (
                <div className="fixed inset-0 z-[60] bg-black">
                    <WatchReels
                        isEmbedded={true}
                        initialReelId={selectedReelId}
                        filterSellerId={sellerId} // Pass seller ID to filter logic
                        onClose={() => setSelectedReelId(null)}
                    />
                </div>
            )}
        </div>
    );
};

export default SellerProfile;
