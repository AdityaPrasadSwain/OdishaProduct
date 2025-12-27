import React, { useState } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import StarRating from '../common/StarRating';
import reviewApi from '../../api/reviewApi';
import Swal from 'sweetalert2';

const ReviewModal = ({ isOpen, onClose, product, orderItemId, existingReview, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Initialize state when modal opens or existingReview changes
    React.useEffect(() => {
        if (isOpen) {
            if (existingReview) {
                setRating(existingReview.rating);
                setReviewText(existingReview.reviewText || '');
                setImages([]); // We don't preload images for editing due to File object constraint, user must re-upload if they want to change them.
                // Or we could show existing URLs and allow "replace all"? 
                // Plan: Just clear and let them upload new ones if they want to change.
            } else {
                setRating(0);
                setReviewText('');
                setImages([]);
            }
        }
    }, [isOpen, existingReview]);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            Swal.fire('Limit Exceeded', 'You can only upload up to 5 images.', 'warning');
            return;
        }
        setImages([...images, ...files]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            Swal.fire('Rating Required', 'Please provide a star rating.', 'warning');
            return;
        }

        setUploading(true);
        try {
            const reviewData = {
                productId: product.id,
                orderItemId: orderItemId,
                rating: rating,
                reviewText: reviewText
            };

            if (existingReview) {
                await reviewApi.editReview(existingReview.id, reviewData, images);
                Swal.fire('Updated', 'Review updated successfully!', 'success');
            } else {
                await reviewApi.submitReview(reviewData, images);
                Swal.fire('Success', 'Review submitted successfully!', 'success');
            }

            onReviewSubmitted();
            onClose();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to submit review.', 'error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">{existingReview ? 'Edit Review' : 'Write a Review'}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* Product Info */}
                    <div className="flex gap-4 items-center mb-4">
                        <img
                            src={product.images?.[0]?.imageUrl || product.imageUrl || '/placeholder.png'}
                            alt={product.title || product.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{product.title || product.name}</p>
                            <p className="text-sm text-gray-500">How would you rate this product?</p>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center py-2">
                        <StarRating rating={rating} setRating={setRating} size={32} />
                    </div>

                    {/* Review Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none h-32"
                            placeholder="Tell us what you liked or didn't like..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {existingReview ? 'Update Photos (Uploading new ones will replace old ones)' : 'Add Photos (Optional)'}
                        </label>
                        {/* Show existing images if in edit mode and no new images selected yet? 
                             For simplicity, we show user uploaded images only. 
                             If they want to keep old ones, they shouldn't upload new ones? 
                             Wait, my backend logic replaces ALL images if 'files' is not empty.
                             So if they upload 1 new image, all old ones are gone. 
                             This is acceptable for "Re-upload" flow.
                         */}
                        <div className="flex flex-wrap gap-2">
                            {images.map((img, index) => (
                                <div key={index} className="relative w-20 h-20 group">
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg border"
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}

                            {images.length < 5 && (
                                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:text-orange-500 transition-all text-gray-400">
                                    <Upload size={20} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{images.length}/5 images</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={uploading}
                        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {uploading ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
