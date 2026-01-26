import React, { useState, useEffect } from 'react';
import { useProductContext } from '../../../../context/ProductContext';
import { updateImagesStep3 } from '../../../../api/productWizardApi';
import { Close, CloudUpload, VideoLibrary } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

const ProductImages = ({ onNext, onBack }) => {
    const { productData, productId, fetchProductData, setLoading: setGlobalLoading } = useProductContext();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Reel State
    const [reelFile, setReelFile] = useState(null);
    const [reelPreview, setReelPreview] = useState(null);

    useEffect(() => {
        if (productData.imageUrls) {
            setImages(productData.imageUrls.map(url => ({
                file: null,
                preview: url,
                isExisting: true
            })));
        }
        if (productData.reelUrl) {
            setReelPreview(productData.reelUrl);
        }
    }, [productData.imageUrls, productData.reelUrl]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = files.map(file => ({
                file: file,
                preview: URL.createObjectURL(file),
                isExisting: false
            }));
            setImages(prev => [...prev, ...newImages].slice(0, 8));
        }
    };

    const handleReelChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                alert("Reel size must be less than 50MB");
                return;
            }
            setReelFile(file);
            setReelPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleRemoveReel = () => {
        setReelFile(null);
        setReelPreview(null);
        const input = document.getElementById('reel-upload');
        if (input) input.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Requirement: "Add at least one image"
        if (images.length === 0) {
            alert("Please add at least one image.");
            return;
        }

        setLoading(true);
        setGlobalLoading(true);
        try {
            const newFiles = images.filter(img => !img.isExisting).map(img => img.file);
            const existingUrls = images.filter(img => img.isExisting).map(img => img.preview);

            await updateImagesStep3(productId, newFiles, existingUrls, reelFile);

            await fetchProductData(productId);

            onNext();
        } catch (err) {
            console.error("Error updating images:", err);
            alert("Failed to update images: " + err.message);
        } finally {
            setLoading(false);
            setGlobalLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in-up">
            <p className="text-gray-500 mb-6">Please fill in the details below to proceed.</p>

            {/* Images Section */}
            <div className="mb-8">
                <h4 className="font-bold text-lg text-gray-800 mb-4">Upload Product Images</h4>

                <div className="bg-blue-900/10 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 font-medium">
                        Note: Supported formats: JPG, PNG, WEBP. Max size: 2MB per image. Max 8 images.
                    </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative group">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="pointer-events-none flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <CloudUpload fontSize="medium" />
                        </div>
                        <p className="text-gray-700 font-semibold mb-1">Drag & Drop or <span className="text-blue-600">Browse</span></p>
                        <p className="text-xs text-gray-400">0 / 8 images selected</p>
                    </div>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {images.map((img, index) => (
                            <div key={index} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200 aspect-square">
                                <img src={img.preview} alt="Product" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-white/90 text-red-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                >
                                    <Close fontSize="small" />
                                </button>
                                {!img.isExisting && <span className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs text-center py-1">New</span>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Reel Section */}
            <div className="mb-8 pt-6 border-t border-gray-100">
                <h4 className="font-bold text-lg text-gray-800 mb-4">Upload Product Reel (Video)</h4>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 font-medium">
                        Note: Supported formats: MP4, MOV. Max length: 60s. Max size: 50MB. (Optional)
                    </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative group">
                    {!reelPreview ? (
                        <>
                            <input
                                id="reel-upload"
                                type="file"
                                accept="video/mp4,video/quicktime"
                                onChange={handleReelChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="pointer-events-none flex flex-col items-center">
                                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <VideoLibrary fontSize="medium" />
                                </div>
                                <p className="text-gray-700 font-semibold mb-1">Drag & Drop Reel or <span className="text-blue-600">Browse</span></p>
                            </div>
                        </>
                    ) : (
                        <div className="relative w-full max-w-xs mx-auto aspect-[9/16] bg-black rounded-lg overflow-hidden shadow-lg">
                            <video src={reelPreview} controls className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={handleRemoveReel}
                                className="absolute top-2 right-2 bg-white/90 text-red-600 rounded-full p-1 shadow-md hover:bg-white transition-colors z-20"
                            >
                                <Close fontSize="small" />
                            </button>
                        </div>
                    )}
                </div>
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
                    className="px-10 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <CircularProgress size={20} color="inherit" /> Saving...
                        </span>
                    ) : (
                        "Save & Continue"
                    )}
                </button>
            </div>
        </form>
    );
};

export default ProductImages;
