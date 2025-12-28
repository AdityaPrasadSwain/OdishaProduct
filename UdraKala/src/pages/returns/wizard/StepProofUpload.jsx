import React from 'react';
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

const StepProofUpload = ({ formData, updateFormData }) => {
    // Current backend supports strictly one 'proofImage' and one 'image' (generic).
    // Design allows multi, so we handle array in state but mapping is done in submit.
    // Here we allow adding to the list.

    const handleFileChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            // Append to existing
            updateFormData('proofImages', [...formData.proofImages, ...filesArray]);
        }
    };

    const removeFile = (index) => {
        const newFiles = [...formData.proofImages];
        newFiles.splice(index, 1);
        updateFormData('proofImages', newFiles);
    };

    const isProofRequired = formData.reason === 'DAMAGED' || formData.reason === 'WRONG_PRODUCT';

    return (
        <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <input
                    type="file"
                    id="proof-upload"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <label htmlFor="proof-upload" className="cursor-pointer block">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CloudArrowUpIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Proof Images</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Click to browse or drag and drop. <br /> Supported: JPG, PNG, WEBP.
                    </p>
                </label>
            </div>

            {/* Preview Grid */}
            {formData.proofImages.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Selected Images ({formData.proofImages.length})</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                        {formData.proofImages.map((file, idx) => (
                            <div key={idx} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => removeFile(idx)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!isProofRequired && formData.proofImages.length === 0 && (
                <p className="text-sm text-gray-500 italic">Optional for this reason, but recommended.</p>
            )}
            {isProofRequired && formData.proofImages.length === 0 && (
                <p className="text-sm text-red-500 font-medium">Proof image is required for your selected reason.</p>
            )}
        </div>
    );
};

export default StepProofUpload;
