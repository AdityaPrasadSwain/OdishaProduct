import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Bookmark, PlaySquare, Settings, CheckCircle } from 'lucide-react';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import PostViewerModal from '../../components/PostViewerModal';

const SellerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [reels, setReels] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        fetchProfile();
        fetchContent();
    }, [id]);

    const fetchProfile = async () => {
        try {
            // Updated to use configured API instance and correct path structure if needed
            // Assuming endpoint is /public/sellers/{id}/profile per controller
            const response = await API.get(`/public/sellers/${id}/profile`);
            setProfile(response.data);
        } catch (error) {
            console.error("Error fetching profile", error);
        }
    };

    const fetchContent = async () => {
        setLoading(true);
        try {
            const [postsRes, reelsRes] = await Promise.all([
                API.get(`/public/sellers/${id}/posts`),
                API.get(`/public/sellers/${id}/reels`)
            ]);
            setPosts(postsRes.data);
            setReels(reelsRes.data);
        } catch (error) {
            console.error("Error fetching content", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        if (!user) return navigate('/login');

        try {
            if (profile.isFollowing) {
                await API.delete(`/sellers/${id}/follow`);
                setProfile(prev => ({
                    ...prev,
                    isFollowing: false,
                    followersCount: prev.followersCount - 1
                }));
            } else {
                await API.post(`/sellers/${id}/follow`);
                setProfile(prev => ({
                    ...prev,
                    isFollowing: true,
                    followersCount: prev.followersCount + 1
                }));
            }
        } catch (error) {
            console.error("Follow action failed", error);
        }
    };

    if (!profile && loading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;

    if (!profile) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 text-white">Seller not found</div>;

    const isOwnProfile = user?.id === profile.id; // Correct check using IDs if available

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white pb-20">

            <div className="max-w-4xl mx-auto px-4 pt-6 md:pt-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start md:gap-12 mb-10">
                    {/* Avatar */}
                    <div className="w-24 h-24 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 mb-4 md:mb-0 shrink-0">
                        <img
                            src={profile.profileImage || 'https://via.placeholder.com/150'}
                            alt={profile.name}
                            className="w-full h-full rounded-full border-4 border-white dark:border-gray-900 object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col items-center md:items-start w-full">
                        {/* Name Row */}
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl md:text-2xl font-light">{profile.shopName || profile.name}</h1>
                                {profile.isVerified && <CheckCircle size={18} className="text-blue-500 fill-blue-500 text-white" />}
                            </div>

                            <div className="flex gap-2">
                                {isOwnProfile ? (
                                    <button onClick={() => navigate('/profile/edit')} className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleFollow}
                                            className={`px-6 py-1.5 rounded-lg text-sm font-medium transition ${profile.isFollowing ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                        >
                                            {profile.isFollowing ? 'Following' : 'Follow'}
                                        </button>
                                        <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                                            Message
                                        </button>
                                    </>
                                )}
                                {isOwnProfile && <Settings size={28} className="p-1 cursor-pointer" />}
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex gap-8 md:gap-10 text-sm md:text-base mb-4">
                            <div className="text-center md:text-left"><span className="font-semibold block md:inline">{profile.postsCount}</span> posts</div>
                            <div className="text-center md:text-left"><span className="font-semibold block md:inline">{profile.followersCount}</span> followers</div>
                            <div className="text-center md:text-left"><span className="font-semibold block md:inline">{profile.followingCount}</span> following</div>
                        </div>

                        {/* Bio */}
                        <div className="text-center md:text-left text-sm whitespace-pre-line max-w-md">
                            <div className="font-semibold mb-1">{profile.name}</div>
                            {profile.bio || "No bio available."}
                        </div>
                    </div>
                </div>

                {/* Highlights (Placeholder - Optional Feature) */}
                {/* <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide"> ... </div> */}

                {/* Tab Navigation */}
                <div className="border-t dark:border-gray-800 flex justify-center gap-12 text-xs font-medium tracking-widest uppercase">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`flex items-center gap-2 py-4 border-t-2 transition ${activeTab === 'posts' ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'border-transparent text-gray-500'}`}
                    >
                        <Grid size={12} /> Posts
                    </button>
                    <button
                        onClick={() => setActiveTab('reels')}
                        className={`flex items-center gap-2 py-4 border-t-2 transition ${activeTab === 'reels' ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'border-transparent text-gray-500'}`}
                    >
                        <PlaySquare size={12} /> Reels
                    </button>
                    <button
                        onClick={() => setActiveTab('tagged')}
                        className={`flex items-center gap-2 py-4 border-t-2 transition ${activeTab === 'tagged' ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white' : 'border-transparent text-gray-500'}`}
                    >
                        <Bookmark size={12} /> Tagged
                    </button>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-3 gap-1 md:gap-4 pb-10">
                    {activeTab === 'posts' && (
                        posts.length > 0 ? (
                            posts.map(post => (
                                <div
                                    key={post.id}
                                    onClick={() => setSelectedPost(post)}
                                    className="aspect-square relative group cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-800"
                                >
                                    <img
                                        src={post.thumbnail || 'https://via.placeholder.com/300'}
                                        alt={post.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-4 backdrop-blur-sm">
                                        <div className="flex items-center gap-1"><Heart className="fill-white" size={18} /> {post.likes || 0}</div>
                                        <div className="flex items-center gap-1"><MessageCircle className="fill-white" size={18} /> {post.comments || 0}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 py-20 text-center text-gray-500 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full border-2 border-gray-800 flex items-center justify-center mb-4"><Grid /></div>
                                <h3 className="text-xl font-bold mb-2">No Posts Yet</h3>
                            </div>
                        )
                    )}

                    {activeTab === 'reels' && (
                        reels.length > 0 ? (
                            reels.map(reel => (
                                <div
                                    key={reel.id}
                                    onClick={() => setSelectedPost({ ...reel, isReel: true })} // Pass isReel flag
                                    className="aspect-[9/16] relative group cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-sm"
                                >
                                    {reel.videoUrl ? (
                                        <video src={reel.videoUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={reel.thumbnail} alt={reel.name} className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute top-2 right-2 text-white drop-shadow-md"><PlaySquare size={20} className="fill-white/20" /></div>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-end p-4">
                                        <div className="text-white text-xs font-semibold flex items-center gap-1">
                                            <PlaySquare size={12} /> {reel.views || 0}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 py-20 text-center text-gray-500 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full border-2 border-gray-800 flex items-center justify-center mb-4"><PlaySquare /></div>
                                <h3 className="text-xl font-bold mb-2">No Reels Yet</h3>
                            </div>
                        )
                    )}

                    {activeTab === 'tagged' && (
                        <div className="col-span-3 py-20 text-center text-gray-500 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full border-2 border-gray-800 flex items-center justify-center mb-4"><Bookmark /></div>
                            <h3 className="text-xl font-bold mb-2">Photos of You</h3>
                            <p>When people tag you in photos, they'll appear here.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Post Viewer Modal */}
            <PostViewerModal
                isOpen={!!selectedPost}
                onClose={() => setSelectedPost(null)}
                post={selectedPost ? { ...selectedPost, sellerName: profile.name, sellerImage: profile.profileImage } : null}
                isReel={selectedPost?.type === "REEL"}
            />
        </div>
    );
};

// Simple Lucide Icons that weren't imported but used in empty state
const Heart = ({ className, size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
);
const MessageCircle = ({ className, size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
);

export default SellerProfile;
