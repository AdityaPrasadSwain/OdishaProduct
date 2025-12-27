import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/api';
import { motion as Motion, AnimatePresence } from 'motion/react';
import {
    Grid, Clapperboard, MonitorPlay, Bookmark, UserSquare2,
    Menu, PlusSquare, ChevronDown, MessageCircle, Heart, Play
} from 'lucide-react';

const SellerProfileView = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('grid');
    const [profileStats, setProfileStats] = useState(null);
    const [reels, setReels] = useState([]);
    const [selectedReel, setSelectedReel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [statsRes, reelsRes] = await Promise.all([
                    API.get('/seller/analytics/summary'),
                    API.get('/seller/analytics/reels')
                ]);
                setProfileStats(statsRes.data);
                setReels(reelsRes.data);
            } catch (error) {
                console.error("Error fetching seller profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    // Helper to format numbers like Instagram (10.5k, 1M)
    const formatCount = (num) => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 10000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    };

    if (loading) return (
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-16 font-sans">
            {/* Navbar (Instagram Style) */}
            <div className="sticky top-0 z-20 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 px-4 h-12 flex items-center justify-between">
                <div className="flex items-center gap-1 cursor-pointer">
                    <span className="font-bold text-xl tracking-tight">{user?.username || user?.email?.split('@')[0] || "username"}</span>
                    <ChevronDown size={16} />
                </div>
                <div className="flex items-center gap-6">
                    <PlusSquare size={24} strokeWidth={1.5} />
                    <Menu size={24} strokeWidth={1.5} />
                </div>
            </div>

            <div className="px-4 pt-4">
                {/* Profile Header Row */}
                <div className="flex items-center justify-between mb-4">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                            <div className="w-full h-full rounded-full border-2 border-white dark:border-black bg-gray-100 overflow-hidden">
                                <img
                                    src={profileStats?.profilePictureUrl || user?.profilePictureUrl || `https://ui-avatars.com/api/?name=${user?.fullName}&background=random`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        {/* Optional: Add Story Plus icon if needed */}
                    </div>

                    {/* Stats */}
                    <div className="flex-1 flex justify-around ml-4 sm:ml-10 text-center">
                        <div className="flex flex-col">
                            <span className="font-bold text-lg sm:text-xl leading-tight">{formatCount(profileStats?.totalReels || reels.length)}</span>
                            <span className="text-[13px] sm:text-sm text-gray-900 dark:text-white/90">Posts</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg sm:text-xl leading-tight">{formatCount(profileStats?.totalFollowers)}</span>
                            <span className="text-[13px] sm:text-sm text-gray-900 dark:text-white/90">Followers</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg sm:text-xl leading-tight">{formatCount(profileStats?.followingCount || 120)}</span>
                            <span className="text-[13px] sm:text-sm text-gray-900 dark:text-white/90">Following</span>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="mb-4">
                    <div className="font-bold text-sm">{profileStats?.shopName || user?.shopName || user?.fullName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Entrepreneur</div>
                    <div className="text-sm whitespace-pre-line leading-snug my-1">
                        {profileStats?.bio || user?.bio || "Bringing you the finest handlooms of Odisha. 🧶✨"}
                    </div>
                    {/* Link */}
                    {user?.website && (
                        <div className="flex items-center gap-1 text-sm font-medium text-[#00376B] dark:text-[#E0F1FF]">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                            <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                                {user.website.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    )}
                </div>

                {/* Action Buttons Row */}
                <div className="flex gap-2 mb-6">
                    <button className="flex-1 bg-gray-100 dark:bg-[#363636] text-sm font-semibold py-1.5 rounded-lg active:opacity-70 transition-opacity">
                        Edit Profile
                    </button>
                    <button className="flex-1 bg-gray-100 dark:bg-[#363636] text-sm font-semibold py-1.5 rounded-lg active:opacity-70 transition-opacity">
                        Share Profile
                    </button>
                    {/* Suggestion Button (Arrow) */}
                    <button className="bg-gray-100 dark:bg-[#363636] p-1.5 rounded-lg active:opacity-70 transition-opacity">
                        <ChevronDown size={20} />
                    </button>
                </div>

                {/* Story Highlights (Placeholder for authenticity) */}
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar mb-2">
                    {['New In', 'Reviews', 'Events', 'FAQs'].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 min-w-[64px]">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1">
                                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-[#1c1c1c]" />
                            </div>
                            <span className="text-xs truncate w-full text-center">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Tabs */}
            <div className="border-t border-gray-200 dark:border-gray-800">
                <div className="flex">
                    {[
                        { id: 'grid', icon: <Grid size={24} /> },
                        { id: 'reels', icon: <Clapperboard size={24} /> }, // Using Clapperboard to look like Reels icon
                        { id: 'videos', icon: <MonitorPlay size={24} /> }, // Placeholder for video/tag
                        { id: 'tagged', icon: <UserSquare2 size={24} /> }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex justify-center items-center py-2.5 border-b-[1px] ${activeTab === tab.id
                                ? 'border-black dark:border-white text-black dark:text-white'
                                : 'border-transparent text-gray-400 dark:text-gray-500'
                                }`}
                        >
                            {tab.icon}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-3 gap-0.5 sm:gap-1 pb-20">
                {activeTab === 'grid' || activeTab === 'reels' ? (
                    reels.map((reel) => (
                        <div
                            key={reel.id}
                            className="relative aspect-square bg-gray-100 dark:bg-gray-800 cursor-pointer group overflow-hidden"
                            onClick={() => setSelectedReel(reel)}
                        >
                            <img
                                src={reel.thumbnailUrl || '/placeholder.png'}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            {/* Type Indicator Icon (Top Right) */}
                            <div className="absolute top-2 right-2 text-white drop-shadow-md">
                                {activeTab === 'reels' ? <Clapperboard size={16} fill="white" /> : <Play size={16} fill="currentColor" className="opacity-90" />}
                            </div>

                            {/* Sold Badge (Custom seller feature integrated subtly) */}
                            {reel.totalSold > 0 && (
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm font-semibold">
                                    {reel.totalSold} Sold
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 py-20 text-center text-gray-500">
                        <div className="w-16 h-16 rounded-full border-2 border-black dark:border-white mx-auto flex items-center justify-center mb-4">
                            {activeTab === 'tagged' ? <UserSquare2 size={32} /> : <MonitorPlay size={32} />}
                        </div>
                        <h3 className="font-bold text-xl text-black dark:text-white mb-2">{activeTab === 'tagged' ? 'Photos of you' : 'Videos'}</h3>
                        <p className="text-sm max-w-xs mx-auto">When people tag you in photos, they'll appear here.</p>
                    </div>
                )}
            </div>

            {/* Modal Player */}
            <AnimatePresence>
                {selectedReel && (
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setSelectedReel(null)}
                    >
                        <div className="relative w-full max-w-xs bg-black rounded-lg overflow-hidden shadow-2xl h-[80vh]" onClick={e => e.stopPropagation()}>
                            <button
                                className="absolute top-4 right-4 z-20 text-white/80 hover:text-white p-2"
                                onClick={() => setSelectedReel(null)}
                            >
                                &times;
                            </button>
                            <video
                                src={selectedReel.videoUrl}
                                className="w-full h-full object-cover"
                                controls
                                autoPlay
                            />
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SellerProfileView;
