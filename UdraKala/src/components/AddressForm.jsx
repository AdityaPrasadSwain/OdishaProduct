import React, { useState } from 'react';
import { addAddress } from '../api/addressApi';
import { X, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';

const AddressForm = ({ isOpen, onClose, onAddressAdded }) => {
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        isDefault: false
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newAddress = await addAddress(formData);
            onAddressAdded(newAddress);
            onClose();
            Swal.fire({
                icon: 'success',
                title: 'Address Added',
                text: 'Your new delivery address has been saved.',
                timer: 1500,
                showConfirmButton: false
            });
            // Reset form
            setFormData({
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'India',
                isDefault: false
            });
        } catch (error) {
            console.error('Failed to add address:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save address. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark bg-opacity-50 backdrop-blur-sm">
            <div className="bg-bg-surface dark:bg-bg-dark rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="flex justify-between items-center p-4 border-b border-border dark:border-border">
                    <h3 className="text-lg font-semibold text-text-primary dark:text-text-onDark flex items-center gap-2">
                        <MapPin size={20} className="text-primary" />
                        Add New Address
                    </h3>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-secondary dark:hover:text-text-secondary transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-1">Street Address</label>
                        <textarea
                            required
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-4 py-2 rounded-lg bg-bg-page dark:bg-bg-dark border border-border dark:border-border text-text-primary dark:text-text-onDark focus:ring-2 focus:ring-primary outline-none transition resize-none"
                            placeholder="House No, Street Name, Area"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-1">City</label>
                            <input
                                required
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-bg-page dark:bg-bg-dark border border-border dark:border-border text-text-primary dark:text-text-onDark focus:ring-2 focus:ring-primary outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-1">State</label>
                            <input
                                required
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-bg-page dark:bg-bg-dark border border-border dark:border-border text-text-primary dark:text-text-onDark focus:ring-2 focus:ring-primary outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-1">ZIP Code</label>
                            <input
                                required
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-bg-page dark:bg-bg-dark border border-border dark:border-border text-text-primary dark:text-text-onDark focus:ring-2 focus:ring-primary outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-text-secondary mb-1">Country</label>
                            <input
                                required
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-bg-page dark:bg-bg-dark border border-border dark:border-border text-text-primary dark:text-text-onDark focus:ring-2 focus:ring-primary outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleChange}
                            id="isDefault"
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                        />
                        <label htmlFor="isDefault" className="text-sm font-medium text-text-secondary dark:text-text-secondary cursor-pointer">
                            Set as default address
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-text-onDark font-bold rounded-lg shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? 'Saving...' : 'Save Address'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddressForm;
