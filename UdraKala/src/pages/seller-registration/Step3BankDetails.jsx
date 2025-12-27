import { useState, useEffect } from 'react';
import API from '../../api/api';
import Swal from 'sweetalert2';
import { validateIFSC, validateRequired } from '../../utils/validation';
import { Building, CreditCard } from 'lucide-react';

const Step3BankDetails = ({ onNext }) => {
    const [formData, setFormData] = useState({
        accountHolderName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('seller_reg_step3');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const upperValue = name === 'accountHolderName' || name === 'bankName' ? value : value.toUpperCase();
        setFormData(prev => ({ ...prev, [name]: upperValue }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
        localStorage.setItem('seller_reg_step3', JSON.stringify({ ...formData, [name]: upperValue }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!validateRequired(formData.accountHolderName)) newErrors.accountHolderName = "Account Holder Name is required";
        if (!validateRequired(formData.accountNumber)) newErrors.accountNumber = "Account Number is required";
        if (!validateRequired(formData.bankName)) newErrors.bankName = "Bank Name is required";
        if (!validateIFSC(formData.ifscCode)) newErrors.ifscCode = "Invalid IFSC Code (e.g., SBIN0001234)";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            await API.post('/sellers/register/bank', formData);

            // Clear local storage
            localStorage.removeItem('seller_reg_step1');
            localStorage.removeItem('seller_reg_step2');
            localStorage.removeItem('seller_reg_step3');

            onNext(); // Navigate to Success Step
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error.response?.data?.message || 'Something went wrong',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">Bank Details</h2>
            <p className="text-center text-gray-500 text-sm mb-6">Enter your bank account details for payouts.</p>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Account Holder Name</label>
                <div className="relative">
                    <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleChange}
                        className={`w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none ${errors.accountHolderName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="John Doe"
                    />
                </div>
                {errors.accountHolderName && <p className="text-red-500 text-xs mt-1">{errors.accountHolderName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Bank Name</label>
                    <div className="relative">
                        <Building className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            className={`w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none ${errors.bankName ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="State Bank of India"
                        />
                    </div>
                    {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">IFSC Code</label>
                    <input
                        type="text"
                        name="ifscCode"
                        maxLength={11}
                        value={formData.ifscCode}
                        onChange={handleChange}
                        className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none uppercase ${errors.ifscCode ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="SBIN0001234"
                    />
                    {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Account Number</label>
                <div className="relative">
                    <CreditCard className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className={`w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="0000 0000 0000 0000"
                    />
                </div>
                {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 mt-6 bg-green-600 text-white rounded-lg font-bold shadow-md hover:bg-green-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                {loading ? 'Submitting...' : 'Complete Registration'}
            </button>
        </form>
    );
};

const UserIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

export default Step3BankDetails;
