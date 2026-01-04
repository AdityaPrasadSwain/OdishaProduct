import React, { useState } from 'react';
import { updateImagesStep3 } from '../../../../api/productWizardApi';

const ProductImages = ({ productId, onNext, onBack }) => {
    const [urls, setUrls] = useState([]);
    const [currentUrl, setCurrentUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdd = () => {
        if (currentUrl && !urls.includes(currentUrl)) {
            setUrls([...urls, currentUrl]);
            setCurrentUrl('');
        }
    };

    const handleRemove = (index) => {
        setUrls(urls.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (urls.length === 0) {
            alert("Please add at least one image.");
            return;
        }
        setLoading(true);
        try {
            await updateImagesStep3(productId, urls);
            onNext();
        } catch (err) {
            alert("Failed to update images: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Product Images</h3>

            <div className="flex gap-4">
                <input
                    value={currentUrl}
                    onChange={(e) => setCurrentUrl(e.target.value)}
                    placeholder="Enter Image URL (https://...)"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className="px-6 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-black transition-all"
                >
                    Add
                </button>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {urls.map((url, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50 flex items-center justify-center">
                        <img src={url} alt={`Product ${idx}`} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }} />
                        <button
                            type="button"
                            onClick={() => handleRemove(idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                            &times;
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1 opacity-0 group-hover:opacity-100">
                            Cover Image {idx === 0 ? '(Main)' : ''}
                        </div>
                    </div>
                ))}
                {urls.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                        No images added yet.
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    &larr; Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-10 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
                >
                    {loading ? 'Saving...' : 'Save & Continue'}
                </button>
            </div>
        </form>
    );
};
export default ProductImages;
