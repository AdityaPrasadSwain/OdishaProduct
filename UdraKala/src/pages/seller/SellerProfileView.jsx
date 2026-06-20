import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/api';
import { motion as Motion, AnimatePresence } from 'motion/react';
import {
    Grid, Clapperboard, MonitorPlay, Bookmark, UserSquare2,
    Menu, PlusSquare, ChevronDown, MessageCircle, Heart, Play,
    Camera, MapPin, Calendar, Link as LinkIcon, Edit3, Share2, Package, Users, X
} from 'lucide-react';

const SellerProfileView = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('gallery');
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

    const formatCount = (num) => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 10000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    };

    if (loading) return (
        <div className="min-h-[400px] bg-transparent flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="bg-transparent font-sans pb-10">
            {/* Cover Banner */}
            <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-sm bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="absolute inset-0 bg-bg-dark/10"></div>
                {/* Decorative Pattern Overlay */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                <button className="absolute bottom-4 right-4 bg-bg-surface/20 hover:bg-bg-surface/30 backdrop-blur-md text-text-onDark px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                    <Camera size={16} /> Edit Cover
                </button>
            </div>

            {/* Profile Info Container */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative -mt-16 sm:-mt-24 mb-6 sm:mb-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-end">
                    
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-xl dark:shadow-2xl dark:shadow-black/60 bg-bg-band shrink-0">
                            <img
                                src={profileStats?.profilePictureUrl || user?.profilePictureUrl || `https://ui-avatars.com/api/?name=${user?.fullName}&background=random`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="absolute bottom-2 right-2 bg-primary hover:bg-primary-hover text-text-onDark p-2.5 rounded-full shadow-md transition-colors border-2 border-white dark:border-border">
                            <Camera size={16} />
                        </button>
                    </div>

                    {/* Basic Info & Actions */}
                    <div className="flex-1 w-full pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary dark:text-text-onDark tracking-tight">
                                {profileStats?.shopName || user?.shopName || user?.fullName}
                            </h1>
                            <p className="text-text-secondary dark:text-text-secondary font-medium mt-1 flex items-center gap-2">
                                @{user?.username || user?.email?.split('@')[0] || "username"}
                                <span className="inline-block w-1 h-1 rounded-full bg-bg-band dark:bg-bg-dark"></span>
                                Entrepreneur
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none bg-primary hover:bg-primary-hover text-text-onDark px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <Edit3 size={16} /> Edit Profile
                            </button>
                            <button className="flex-1 sm:flex-none bg-bg-surface dark:bg-bg-dark hover:bg-bg-page dark:hover:bg-bg-dark text-text-secondary dark:text-text-secondary border border-border dark:border-border px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <Share2 size={16} /> Share
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar (Bio & Stats) */}
                    <div className="space-y-6 lg:col-span-1">
                        
                        {/* Bio Card */}
                        <div className="bg-bg-surface dark:bg-bg-dark rounded-xl p-6 shadow-sm border border-border dark:border-border">
                            <h3 className="text-lg font-bold text-text-primary dark:text-text-onDark mb-4">About</h3>
                            <p className="text-text-secondary dark:text-text-secondary text-sm leading-relaxed mb-6 whitespace-pre-line">
                                {profileStats?.bio || user?.bio || "Bringing you the finest handlooms of Odisha. 🧶✨\n\nQuality and tradition in every thread."}
                            </p>
                            
                            <div className="space-y-4">
                                {user?.website && (
                                    <div className="flex items-center gap-3 text-sm text-text-secondary dark:text-text-secondary">
                                        <div className="w-8 h-8 rounded-full bg-bg-page dark:bg-bg-dark/50 flex items-center justify-center">
                                            <LinkIcon size={16} className="text-text-secondary" />
                                        </div>
                                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary dark:text-primary hover:underline truncate font-medium">
                                            {user.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm text-text-secondary dark:text-text-secondary">
                                    <div className="w-8 h-8 rounded-full bg-bg-page dark:bg-bg-dark/50 flex items-center justify-center">
                                        <MapPin size={16} className="text-text-secondary" />
                                    </div>
                                    <span>Odisha, India</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-secondary dark:text-text-secondary">
                                    <div className="w-8 h-8 rounded-full bg-bg-page dark:bg-bg-dark/50 flex items-center justify-center">
                                        <Calendar size={16} className="text-text-secondary" />
                                    </div>
                                    <span>Joined {new Date().getFullYear()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modern Stat Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-bg-surface dark:bg-bg-dark rounded-xl p-5 shadow-sm border border-border dark:border-border flex flex-col items-center text-center">
                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-primary-hover/30 flex items-center justify-center mb-3">
                                    <Users size={20} className="text-primary dark:text-primary" />
                                </div>
                                <span className="text-2xl font-bold text-text-primary dark:text-text-onDark">{formatCount(profileStats?.totalFollowers)}</span>
                                <span className="text-sm font-medium text-text-secondary dark:text-text-secondary mt-1">Followers</span>
                            </div>
                            <div className="bg-bg-surface dark:bg-bg-dark rounded-xl p-5 shadow-sm border border-border dark:border-border flex flex-col items-center text-center">
                                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                                    <Package size={20} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-2xl font-bold text-text-primary dark:text-text-onDark">{formatCount(profileStats?.totalReels || reels.length)}</span>
                                <span className="text-sm font-medium text-text-secondary dark:text-text-secondary mt-1">Posts</span>
                            </div>
                        </div>

                    </div>

                    {/* Right Main Area (Gallery) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Desktop Tabs */}
                        <div className="bg-bg-surface dark:bg-bg-dark rounded-xl shadow-sm border border-border dark:border-border flex overflow-hidden">
                            {[
                                { id: 'gallery', label: 'Media Gallery', icon: <Grid size={18} /> },
                                { id: 'reels', label: 'Reels', icon: <Clapperboard size={18} /> },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold text-sm transition-colors ${
                                        activeTab === tab.id
                                            ? 'text-primary dark:text-primary border-b-2 border-primary dark:border-primary bg-blue-50/50 dark:bg-primary-hover/10'
                                            : 'text-text-secondary hover:text-text-secondary dark:text-text-secondary dark:hover:text-text-secondary'
                                    }`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Gallery Grid */}
                        <div className="bg-bg-surface dark:bg-bg-dark rounded-xl shadow-sm border border-border dark:border-border p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {reels.length > 0 ? (
                                    reels.map((reel) => (
                                        <div
                                            key={reel.id}
                                            className="group relative aspect-[4/5] sm:aspect-square bg-bg-band dark:bg-bg-dark rounded-lg overflow-hidden cursor-pointer shadow-sm"
                                            onClick={() => setSelectedReel(reel)}
                                        >
                                            <img
                                                src={reel.thumbnailUrl || '/placeholder.png'}
                                                alt="Reel Thumbnail"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-bg-dark/0 group-hover:bg-bg-dark/40 transition-colors duration-300 flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                                                    <div className="w-12 h-12 rounded-full bg-bg-surface/20 backdrop-blur-md flex items-center justify-center border border-white/50">
                                                        <Play size={24} fill="white" className="text-text-onDark ml-1" />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="absolute top-2 right-2 text-text-onDark/90 drop-shadow-md">
                                                {activeTab === 'reels' ? <Clapperboard size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                                            </div>

                                            {reel.totalSold > 0 && (
                                                <div className="absolute bottom-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-text-onDark text-xs px-2 py-1 rounded shadow-md font-semibold flex items-center gap-1">
                                                    <Package size={12} /> {reel.totalSold} Sold
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center text-text-secondary flex flex-col items-center">
                                        <div className="w-20 h-20 rounded-full bg-bg-page dark:bg-bg-dark flex items-center justify-center mb-4 border border-border dark:border-border">
                                            <MonitorPlay size={32} className="text-text-secondary" />
                                        </div>
                                        <h3 className="font-bold text-xl text-text-primary dark:text-text-onDark mb-2">No Media Uploaded</h3>
                                        <p className="text-sm max-w-sm text-text-secondary dark:text-text-secondary">Share your latest handloom products and connect with your audience through reels and photos.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Player */}
            <AnimatePresence>
                {selectedReel && (
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-bg-dark/95 flex items-center justify-center p-4 backdrop-blur-md"
                        onClick={() => setSelectedReel(null)}
                    >
                        <div className="relative w-full max-w-sm bg-bg-dark rounded-2xl overflow-hidden shadow-2xl h-[85vh] border border-border" onClick={e => e.stopPropagation()}>
                            <button
                                className="absolute top-4 right-4 z-20 text-text-onDark/60 hover:text-text-onDark bg-bg-dark/40 hover:bg-bg-dark/60 rounded-full p-2 transition-colors"
                                onClick={() => setSelectedReel(null)}
                            >
                                <X size={20} />
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
