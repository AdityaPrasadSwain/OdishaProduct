import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createProductStep1, updateBasicInfoStep1 } from '../../../../api/productWizardApi';
import { getActiveCategories } from '../../../../api/categoryApi';
import { generateProductDescription } from '../../../../api/aiApi';
import AiAssistButton from '../../../../components/AiAssistButton';

const InputGroup = ({ label, name, type = "text", required = false, placeholder = "", value, onChange }) => (
    <div>
        <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-2">{label} {required && <span className="text-status-error">*</span>}</label>
        <input
            type={type}
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-400 bg-bg-page dark:bg-bg-dark focus:bg-bg-surface dark:focus:bg-bg-dark dark:text-text-secondary"
            placeholder={placeholder}
        />
    </div>
);

const BasicInfo = ({ onNext, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: '',
        material: '',
        color: '',
        size: '',
        origin: '',
        packOf: '1'
    });
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const data = await getActiveCategories();
                setCategories(data);
                // Pre-select first category if available and no category selected and no initialData
                if (data && data.length > 0 && !formData.categoryId && !initialData) {
                    setFormData(prev => ({ ...prev, categoryId: data[0].id }));
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCats();
    }, []);

    // Load initial data for edit mode
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                categoryId: initialData.category?.id || initialData.categoryId || '',
                material: initialData.material || '',
                color: initialData.color || '',
                size: initialData.size || '',
                origin: initialData.origin || '',
                packOf: initialData.packOf || '1'
            });
            // If we have an ID, we might call onNext immediately to set parent ID? 
            // Better to just let user click Next, but we need to tell parent generic ID is set?
            // Actually parent passed initialData, so parent KNOWS ID.
            if (initialData.id) {
                // We don't need to notify parent of ID again, it gave it to us.
            }
        }
    }, [initialData]);

    const handleGenerateDescription = async () => {
        if (!formData.name || !formData.categoryId) {
            Swal.fire("Info", "Please enter Product Name and Category first.", "info");
            return;
        }

        try {
            // Find category name for better context
            const categoryName = categories.find(c => c.id === formData.categoryId)?.name || '';

            const description = await generateProductDescription({
                title: formData.name,
                features: `${formData.material || ''}, ${formData.color || ''}`,
                category: categoryName
            });
            setFormData(prev => ({ ...prev, description: description }));
        } catch (error) {
            Swal.fire("Error", "Could not generate description", "error");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (initialData && initialData.id) {
                // Update mode
                await updateBasicInfoStep1(initialData.id, formData);
                res = { id: initialData.id };
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Basic info updated successfully',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                // Create mode
                res = await createProductStep1(formData);
                if (res && res.id) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Saved!',
                        text: 'Basic info saved successfully',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            }

            if (res && res.id) {
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
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary">Description</label>
                        <AiAssistButton onClick={handleGenerateDescription} label="AI Write" className="text-xs py-1 px-2" />
                    </div>
                    <textarea
                        name="description"
                        rows="4"
                        onChange={handleChange}
                        value={formData.description || ''}
                        className="w-full px-4 py-3 border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-400 bg-bg-page dark:bg-bg-dark focus:bg-bg-surface dark:focus:bg-bg-dark dark:text-text-secondary resize-none"
                        placeholder="Detailed description about the product..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-text-secondary dark:text-text-secondary mb-2">Category <span className="text-status-error">*</span></label>
                    <select
                        name="categoryId"
                        required
                        value={formData.categoryId || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-bg-page dark:bg-bg-dark dark:text-text-secondary"
                    >
                        <option value="" disabled>Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

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
                    className={`px-10 py-3 rounded-xl font-bold text-text-onDark shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 ${loading ? 'bg-bg-band cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-text-onDark" viewBox="0 0 24 24">
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
