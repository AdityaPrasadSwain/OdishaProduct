import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Play, Heart, MessageCircle, Eye, Loader2, Send, X } from 'lucide-react';
import API from '../../api/api';
import Swal from 'sweetalert2';
import Modal from '../../components/ui/Modal';
import Card from '../../components/ui/Card';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/ui/Button';

const SellerReelsDashboard = () => {
    const { theme } = useTheme();
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ followers: 0, totalReels: 0, totalLikes: 0, totalComments: 0 });

    // Modal State for Comments
    const [selectedReel, setSelectedReel] = useState(null);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null); // comment ID being replied to

    const muiTheme = useMemo(() => createTheme({
        palette: {
            mode: theme === 'dark' ? 'dark' : 'light',
            primary: { main: '#ea580c' }, // Orange
            background: {
                paper: theme === 'dark' ? '#1f2937' : '#ffffff',
                default: theme === 'dark' ? '#111827' : '#ffffff',
            },
            text: {
                primary: theme === 'dark' ? '#f3f4f6' : '#111827',
                secondary: theme === 'dark' ? '#9ca3af' : '#4b5563',
            },
        },
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    root: { border: 'none' },
                    columnHeaders: {
                        backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                        color: theme === 'dark' ? '#e5e7eb' : '#1f2937'
                    }
                }
            }
        }
    }), [theme]);

    useEffect(() => {
        fetchData();
        fetchOverview();
    }, []);

    const fetchData = async () => {
        try {
            const res = await API.get('/seller/analytics/reels');
            setReels(res.data);
        } catch (e) {
            console.error("Failed to fetch reel stats", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchOverview = async () => {
        try {
            const res = await API.get('/seller/analytics/overview');
            setStats(res.data);
        } catch (e) { console.error(e); }
    };

    const handleViewComments = async (reel) => {
        setSelectedReel(reel);
        setShowCommentModal(true);
        setLoadingComments(true);
        try {
            const res = await API.get(`/reels/${reel.id}/comments`);
            setComments(res.data);
        } catch (e) {
            console.error(e);
            Swal.fire("Error", "Failed to load comments", "error");
        } finally {
            setLoadingComments(false);
        }
    };

    const handleReply = async (parentId) => {
        if (!replyText.trim()) return;
        try {
            const res = await API.post(`/reels/${selectedReel.id}/comments`, {
                comment: replyText,
                parentId: parentId
            });

            // Optimistically update UI structure strictly for view
            // Backend returns flat structure for replies usually, but here we might need to refetch or manually graft
            // Ideally refetch for simple consistency with threaded view
            const reloadRes = await API.get(`/reels/${selectedReel.id}/comments`);
            setComments(reloadRes.data);

            setReplyText("");
            setReplyingTo(null);

            // Update the local reels state to reflect the new comment count immediately
            setReels(prevReels => prevReels.map(r =>
                r.id === selectedReel.id
                    ? { ...r, comments: r.comments + 1 }
                    : r
            ));

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Reply sent',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (e) {
            Swal.fire("Error", "Failed to reply", "error");
        }
    };

    const columns = [
        {
            field: 'thumbnail', headerName: 'Reel', width: 100,
            renderCell: (params) => (
                <div
                    onClick={() => handleViewComments(params.row)}
                    className="relative w-12 h-20 bg-gray-900 rounded overflow-hidden group cursor-pointer mt-1"
                >
                    <img src={params.row.thumbnailUrl} alt="reel" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                        <Play size={20} className="text-white fill-white" />
                    </div>
                </div>
            )
        },
        { field: 'caption', headerName: 'Caption', flex: 1, minWidth: 200 },
        {
            field: 'engagement', headerName: 'Engagement', width: 200,
            renderCell: (params) => (
                <div className="flex gap-4 text-sm items-center h-full">
                    <span className="flex items-center gap-1"><Heart size={16} className="text-red-500" /> {params.row.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={16} className="text-blue-500" /> {params.row.comments}</span>
                </div>
            )
        },
        {
            field: 'createdAt', headerName: 'Posted On', width: 150,
            valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'N/A'
        },
        {
            field: 'actions', headerName: 'Actions', width: 150,
            renderCell: (params) => (
                <Button size="sm" variant="outline" onClick={() => handleViewComments(params.row)}>
                    View Comments
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="flex items-center gap-4 bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-none">
                    <div className="p-3 bg-white/20 rounded-full"><Eye size={24} /></div>
                    <div><p className="text-xs opacity-80">Total Reels</p><h3 className="text-2xl font-bold">{stats.totalReels}</h3></div>
                </Card>
                <Card className="flex items-center gap-4 bg-gradient-to-br from-pink-500 to-rose-600 text-white border-none">
                    <div className="p-3 bg-white/20 rounded-full"><Heart size={24} /></div>
                    <div><p className="text-xs opacity-80">Total Likes</p><h3 className="text-2xl font-bold">{stats.totalLikes}</h3></div>
                </Card>
                <Card className="flex items-center gap-4 bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-none">
                    <div className="p-3 bg-white/20 rounded-full"><MessageCircle size={24} /></div>
                    <div><p className="text-xs opacity-80">Total Comments</p><h3 className="text-2xl font-bold">{stats.totalComments}</h3></div>
                </Card>
                <Card className="flex items-center gap-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none">
                    <div className="p-3 bg-white/20 rounded-full"><Eye size={24} /></div> {/* Icon reuse but represents followers */}
                    <div><p className="text-xs opacity-80">Followers</p><h3 className="text-2xl font-bold">{stats.followers}</h3></div>
                </Card>
            </div>

            <Card title="Reel Performance">
                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-orange-500" /></div>
                ) : (
                    <ThemeProvider theme={muiTheme}>
                        <Paper sx={{ width: '100%', height: 500, boxShadow: 'none' }}>
                            <DataGrid
                                rows={reels}
                                columns={columns}
                                pageSizeOptions={[5, 10]}
                                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                                disableRowSelectionOnClick
                                rowHeight={90}
                            />
                        </Paper>
                    </ThemeProvider>
                )}
            </Card>

            {/* Comments & Watch Modal */}
            {showCommentModal && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-xl shadow-2xl h-[85vh] flex flex-col md:flex-row overflow-hidden">

                        {/* Left Side: Video Player */}
                        <div className="w-full md:w-[400px] bg-black flex items-center justify-center relative">
                            {selectedReel?.videoUrl ? (
                                <video
                                    src={selectedReel.videoUrl}
                                    className="max-h-full max-w-full w-auto h-auto object-contain"
                                    controls
                                    autoPlay
                                    loop
                                    disablePictureInPicture
                                    controlsList="nodownload"
                                />
                            ) : (
                                <div className="text-white text-sm">Video not available</div>
                            )}
                            <button
                                onClick={() => setShowCommentModal(false)}
                                className="absolute top-4 left-4 text-white/80 hover:text-white md:hidden bg-black/50 rounded-full p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Right Side: Comments */}
                        <div className="flex-1 flex flex-col h-full border-l dark:border-gray-700">
                            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                                <h3 className="font-bold flex items-center gap-2">
                                    <span className="text-orange-500 truncate max-w-[200px]">{selectedReel.caption || 'Reel'}</span>
                                </h3>
                                <button onClick={() => setShowCommentModal(false)} className="hidden md:block"><X className="text-gray-500" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
                                {loadingComments ? <div className="text-center p-4">Loading...</div> :
                                    comments.length === 0 ? <p className="text-center text-gray-500">No comments yet</p> :
                                        comments.map(comment => (
                                            <div key={comment.id} className="space-y-3">
                                                {/* Main Comment */}
                                                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-xs font-bold text-orange-700 dark:text-orange-200">
                                                                {comment.user.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{comment.user}</p>
                                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{comment.content}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="mt-2 flex gap-2">
                                                        <button
                                                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                                            className="text-xs text-blue-500 font-medium hover:underline"
                                                        >
                                                            {replyingTo === comment.id ? 'Cancel Reply' : 'Reply'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Inline Reply Input */}
                                                {replyingTo === comment.id && (
                                                    <div className="pl-10 flex gap-2 animate-fade-in-down">
                                                        <input
                                                            autoFocus
                                                            className="flex-1 text-sm border rounded px-3 py-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                                            placeholder={`Reply to ${comment.user}...`}
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                        />
                                                        <Button size="sm" onClick={() => handleReply(comment.id)}><Send size={14} /></Button>
                                                    </div>
                                                )}

                                                {/* Nested Replies */}
                                                {comment.replies && comment.replies.map(reply => (
                                                    <div key={reply.id} className="pl-10 flex gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-blue-200 shrink-0">
                                                            {reply.user.charAt(0)}
                                                        </div>
                                                        <div className={`bg-gray-100 dark:bg-gray-800 p-2 rounded-lg flex-1 ${reply.isSellerReply ? 'border-l-4 border-orange-500' : ''}`}>
                                                            <div className="flex justify-between">
                                                                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                                                                    {reply.user} {reply.isSellerReply && <span className="bg-orange-500 text-white px-1 rounded text-[9px] ml-1">SELLER</span>}
                                                                </span>
                                                                <span className="text-[10px] text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{reply.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerReelsDashboard;
