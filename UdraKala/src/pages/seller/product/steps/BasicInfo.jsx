import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { createProductStep1 } from '../../../../api/productWizardApi';

const InputGroup = ({ label, name, type = "text", required = false, placeholder = "", value, onChange }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
        <input
            type={type}
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 dark:text-gray-100"
            placeholder={placeholder}
        />
    </div>
);

const BasicInfo = ({ onNext }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: 'ef9b5636-2244-486a-b286-64cc1c641886', // Example/Default UUID
        material: '',
        color: '',
        size: '',
        origin: '',
        packOf: '1'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await createProductStep1(formData);
            if (res && res.id) {
                Swal.fire({
                    icon: 'success',
                    title: 'Saved!',
                    text: 'Basic info saved successfully',
                    timer: 1500,
                    showConfirmButton: false
                });
                onNext(res.id);
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to save',
                text: err.message || 'Something went wrong. Please check your connection.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <InputGroup
                        label="Product Name"
                        name="name"
                        required
                        placeholder="e.g. Handwoven Sambalpuri Saree"
                        value={formData.name || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea
                        name="description"
                        rows="4"
                        onChange={handleChange}
                        value={formData.description || ''}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 dark:text-gray-100 resize-none"
                        placeholder="Detailed description about the product..."
                    />
                </div>

                <InputGroup label="Category UUID" name="categoryId" required placeholder="Paste a valid Category UUID" value={formData.categoryId || ''} onChange={handleChange} />
                <InputGroup label="Material" name="material" placeholder="e.g. Cotton, Silk" value={formData.material || ''} onChange={handleChange} />
                <InputGroup label="Color" name="color" placeholder="e.g. Red, Blue" value={formData.color || ''} onChange={handleChange} />
                <InputGroup label="Size" name="size" placeholder="e.g. Free Size, L, XL" value={formData.size || ''} onChange={handleChange} />
                <InputGroup label="Origin" name="origin" placeholder="e.g. Bargarh, Odisha" value={formData.origin || ''} onChange={handleChange} />
                <InputGroup label="Pack Of" name="packOf" placeholder="e.g. 1" value={formData.packOf || ''} onChange={handleChange} />
            </div>

            <div className="flex justify-end pt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-10 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Save & Continue <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </span>
                    )}
                </button>
            </div>
        </form>
    );
};
export default BasicInfo;
