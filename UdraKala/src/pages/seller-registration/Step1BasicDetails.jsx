import { useState, useEffect } from 'react';
import API from '../../api/api';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePhone, validatePassword, validateRequired } from '../../utils/validation';
import { User, Camera, Upload } from 'lucide-react';

const Step1BasicDetails = ({ onNext }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        businessName: ''
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Check if we have saved data in localStorage to restore (optional UX bonus)
    useEffect(() => {
        const savedData = localStorage.getItem('seller_reg_step1');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-clear error
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }

        // Save to local storage for persistence (text fields only)
        localStorage.setItem('seller_reg_step1', JSON.stringify({ ...formData, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate Type
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                Swal.fire('Invalid File', 'Only JPEG and PNG are allowed.', 'error');
                return;
            }
            // Validate Size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire('File too large', 'Max file size is 5MB.', 'error');
                return;
            }

            setProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, profileImage: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!validateRequired(formData.fullName)) newErrors.fullName = "Full Name is required";
        if (!validateRequired(formData.businessName)) newErrors.businessName = "Business Name is required";
        if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
        if (!validatePhone(formData.phone)) newErrors.phone = "Phone must be 10 digits";
        if (!validatePassword(formData.password)) newErrors.password = "Password must be at least 8 chars";
        if (!profileImage) newErrors.profileImage = "Profile photo is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const data = new FormData();
        data.append('fullName', formData.fullName);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('password', formData.password);
        data.append('businessName', formData.businessName);
        data.append('role', 'SELLER'); // Explicitly set role
        if (profileImage) {
            data.append('profileImage', profileImage);
        }

        try {
            const res = await API.post('/sellers/register/basic', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Store sellerId for next steps if returned
            if (res.data.sellerId) {
                localStorage.setItem('current_seller_id', res.data.sellerId);
            }

            // Store token if auto-logged in or returned
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
            }

            Swal.fire({
                icon: 'success',
                title: 'Basic Details Saved',
                text: 'Moving to document upload...',
                timer: 1500,
                showConfirmButton: false
            });
            onNext();

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.response?.data?.message || 'Something went wrong',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Basic Information</h2>

            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 mb-2">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover border-4 border-orange-100 shadow-md" />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-50 text-gray-400">
                            <User size={48} />
                        </div>
                    )}
                    <label htmlFor="profileUpload" className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full cursor-pointer hover:bg-orange-700 shadow-sm transition-colors">
                        <Camera size={18} />
                    </label>
                    <input
                        id="profileUpload"
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>
                <p className="text-xs text-gray-500">Upload Profile Photo (Max 5MB)</p>
                {errors.profileImage && <p className="text-red-500 text-xs mt-1">{errors.profileImage}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name</label>
                    <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all ${errors.businessName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="My Handloom Shop"
                    />
                    {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="9876543210"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Min 8 characters"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold shadow-md hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                    </span>
                ) : 'Save & Continue'}
            </button>
        </form>
    );
};

export default Step1BasicDetails;
