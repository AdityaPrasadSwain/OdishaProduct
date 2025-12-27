import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import Swal from 'sweetalert2';
import { Camera, User, Phone, MapPin, FileText, Save, Edit2, X } from 'lucide-react';
import { motion } from 'motion/react';
import ProfileSkeleton from '../components/skeletons/ProfileSkeleton';

const Profile = () => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
        bio: '',
        gender: ''
    });

    // Image State
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await API.get('/user/profile');
            const data = res.data;
            setFormData({
                fullName: data.fullName || '',
                phoneNumber: data.phoneNumber || '',
                address: data.address || '',
                bio: data.bio || '',
                gender: data.gender || ''
            });
            setImagePreview(data.profilePictureUrl);
        } catch (error) {
            console.error("Failed to fetch profile", error);
            Swal.fire('Error', 'Failed to load profile data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const data = new FormData();
            data.append('fullName', formData.fullName);
            data.append('phoneNumber', formData.phoneNumber);
            data.append('address', formData.address);
            data.append('bio', formData.bio);
            data.append('gender', formData.gender);

            if (selectedImage) {
                data.append('profileImage', selectedImage);
            }

            // Explicitly set content type to multipart/form-data though axios usually detects it
            // API instance sets json by default so we might need to override
            const res = await API.put('/user/profile', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Your profile has been updated successfully',
                timer: 2000,
                showConfirmButton: false
            });

            // Refresh global auth user state to reflect changes elsewhere
            await refreshUser();

            setIsEditing(false);
            setSelectedImage(null); // Clear selected file
            // Update preview with returned url just in case
            if (res.data.profilePictureUrl) {
                setImagePreview(res.data.profilePictureUrl);
            }

        } catch (error) {
            console.error("Update failed", error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to update profile', 'error');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
            >
                {/* Header Background */}
                <div className="h-48 bg-gradient-to-r from-orange-400 to-amber-600 relative">
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="relative px-6 pb-8">
                    {/* Profile Image */}
                    <div className="relative -mt-24 mb-6 flex flex-col md:flex-row items-end md:items-end gap-6">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg bg-gray-100 relative">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <User size={64} />
                                    </div>
                                )}

                                {isEditing && (
                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="text-white" size={32} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
                                {formData.fullName || 'User Name'}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                {user?.email} • <span className="uppercase">{user?.roles?.[0]?.replace('ROLE_', '')}</span>
                            </p>
                        </div>

                        <div className="mb-4">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2"
                                >
                                    <Edit2 size={18} />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setSelectedImage(null);
                                            fetchProfile(); // Reset to original data
                                        }}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                                        disabled={updating}
                                    >
                                        <X size={18} /> Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={updating}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg hover:shadow-green-500/30 transition-colors flex items-center gap-2"
                                    >
                                        {updating ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Save size={18} />
                                        )}
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                    <User size={16} /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                    <Phone size={16} /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                    <User size={16} /> Gender
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                    <MapPin size={16} /> Address
                                </label>
                                <textarea
                                    name="address"
                                    rows="1"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                    <FileText size={16} /> Bio
                                </label>
                                <textarea
                                    name="bio"
                                    rows="4"
                                    placeholder="Tell us a bit about yourself..."
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
