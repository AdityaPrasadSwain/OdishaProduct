import React, { useState, useEffect } from 'react';
import { updateImagesStep3 } from '../../../../api/productWizardApi';
import Swal from 'sweetalert2';

const ProductImages = ({ productId, onNext, onBack, initialData }) => {
    // Unified state for all images (existing and new)
    // Item structure: { type: 'existing'|'new', url: string, file?: File }
    const [allImages, setAllImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reelFile, setReelFile] = useState(null);
    const [existingReelUrl, setExistingReelUrl] = useState(null);

    // Initialize with existing data
    useEffect(() => {
        if (initialData) {
            if (initialData.imageUrls) {
                const existing = initialData.imageUrls.map(url => ({
                    type: 'existing',
                    url: url
                }));
                setAllImages(existing);
            }
            if (initialData.reelUrl) {
                setExistingReelUrl(initialData.reelUrl);
            }
        }
    }, [initialData]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (allImages.length + files.length > 8) {
            Swal.fire({
                icon: 'warning',
                title: 'Limit Exceeded',
                text: 'Maximum 8 images allowed.',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        const validFiles = files.filter(file =>
            ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)
        );

        if (validFiles.length !== files.length) {
            Swal.fire({
                icon: 'info',
                title: 'Invalid Files Ignored',
                text: 'Only JPG, PNG, and WEBP are allowed. Some files were skipped.',
                confirmButtonColor: '#3085d6',
            });
        }

        const newItems = validFiles.map(file => ({
            type: 'new',
            url: URL.createObjectURL(file), // Preview URL
            file: file
        }));

        setAllImages(prev => [...prev, ...newItems]);
    };

    const handleReelSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Size limit (e.g. 50MB)
        if (file.size > 50 * 1024 * 1024) {
            Swal.fire('Error', 'File size exceeds 50MB limit', 'error');
            return;
        }

        // Type validation
        if (!['video/mp4', 'video/quicktime'].includes(file.type)) {
            Swal.fire('Error', 'Only MP4 and MOV formats are allowed', 'error');
            return;
        }

        setReelFile(file);
    };

    const handleRemove = (index) => {
        const itemToRemove = allImages[index];
        if (itemToRemove.type === 'new') {
            URL.revokeObjectURL(itemToRemove.url);
        }
        setAllImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveReel = () => {
        setReelFile(null);
        setExistingReelUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (allImages.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No Images',
                text: 'Please select at least one image.',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();

            // Append new files
            allImages.filter(img => img.type === 'new').forEach(img => {
                formData.append('images', img.file);
            });

            // Append kept existing images
            allImages.filter(img => img.type === 'existing').forEach(img => {
                formData.append('keptImages', img.url);
            });

            // Append Reel if selected
            if (reelFile) {
                formData.append('reel', reelFile);
            }

            await updateImagesStep3(productId, formData);
            onNext();
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: err.response?.data?.message || err.message || 'An error occurred while uploading.',
                confirmButtonColor: '#d33',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b dark:border-gray-700 pb-3 mb-4">
                    Upload Product Images
                </h3>

                <div className="bg-blue-50 dark:bg-gray-800/50 border border-blue-100 dark:border-gray-700 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        <span className="font-semibold">Note:</span> Supported formats: JPG, PNG, WEBP. Max size: 2MB per image. Max 8 images.
                    </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-center cursor-pointer relative">
                    <input
                        type="file"
                        multiple
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">
                            Drag & Drop or <span className="text-blue-600 hover:underline">Browse Images</span>
                        </p>
                        <p className="text-xs text-gray-400">
                            {allImages.length} / 8 images selected
                        </p>
                    </div>
                </div>

                {/* Preview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                    {allImages.map((img, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 aspect-square shadow-sm bg-gray-50 dark:bg-gray-900">
                            <img
                                src={img.url}
                                alt={`Preview ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(idx)}
                                className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                title="Remove Image"
                            >
                                &times;
                            </button>
                            {idx === 0 && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider text-center py-1">
                                    Main Image
                                </div>
                            )}
                            {img.type === 'existing' && (
                                <div className="absolute top-2 left-2 bg-blue-500/80 text-white text-[10px] px-1.5 py-0.5 rounded shadow">
                                    Saved
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* REEL UPLOAD SECTION */}
            <div className="pt-6 border-t dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b dark:border-gray-700 pb-3 mb-4">
                    Product Reel (Optional)
                </h3>

                <div className="bg-purple-50 dark:bg-gray-800/50 border border-purple-100 dark:border-gray-700 rounded-lg p-4 mb-4">
                    <p className="text-sm text-purple-800 dark:text-purple-300">
                        <span className="font-semibold">Note:</span> Supported formats: MP4, MOV. Max size: 50MB. Short videos (Reels) boost engagement!
                    </p>
                </div>

                {!reelFile && !existingReelUrl ? (
                    <div className="border-2 border-dashed border-purple-300 dark:border-gray-600 rounded-2xl p-8 hover:bg-purple-50 dark:hover:bg-gray-800/50 transition-colors text-center cursor-pointer relative group">
                        <input
                            type="file"
                            accept="video/mp4, video/quicktime"
                            onChange={handleReelSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <svg className="w-12 h-12 text-purple-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-600 dark:text-gray-300 font-medium">
                                Upload a Reel (Video)
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-black aspect-[9/16] w-full max-w-xs mx-auto shadow-lg">
                        <video
                            src={reelFile ? URL.createObjectURL(reelFile) : existingReelUrl}
                            controls
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemoveReel}
                            className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-10"
                            title="Remove Reel"
                        >
                            &times;
                        </button>
                        <div className="absolute bottom-2 left-2 bg-purple-600/80 text-white text-xs px-2 py-1 rounded shadow">
                            {reelFile ? 'New Upload' : 'Existing Reel'}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-8 border-t dark:border-gray-700">
                <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700"
                >
                    &larr; Back
                </button>
                <button
                    type="submit"
                    disabled={loading || allImages.length === 0}
                    className={`px-8 py-2.5 rounded-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900
                        ${loading || allImages.length === 0
                            ? 'bg-gray-400 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                        </span>
                    ) : 'Save & Continue'}
                </button>
            </div>
        </form>
    );
};

export default ProductImages;
