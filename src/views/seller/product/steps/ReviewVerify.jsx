import React, { useState } from 'react';
import { useProductContext } from '../../../../context/ProductContext';
import { Chip, Paper } from '@mui/material';

const ReviewVerify = ({ onEditStep, onSubmit }) => {
    const { productData, loading } = useProductContext();
    const [submitLoading, setSubmitLoading] = useState(false);

    const handlePublish = async () => {
        setSubmitLoading(true);
        await onSubmit(); // Calls handleFinish in wizard
        setSubmitLoading(false);
    };

    if (loading) return <p className="text-center py-8">Loading verification data...</p>;
    if (!productData) return <p className="text-center py-8">No data found.</p>;

    const SectionHeader = ({ title, editIndex }) => (
        <div className="flex justify-between items-center mb-3 mt-6">
            <h4 className="font-bold text-gray-700 uppercase tracking-widest text-sm">{title}</h4>
            <button
                onClick={() => onEditStep(editIndex)}
                className="text-blue-600 text-sm font-semibold hover:underline bg-blue-50 px-3 py-1 rounded-full"
            >
                Edit
            </button>
        </div>
    );

    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-gray-500 font-medium text-sm">{label}</span>
            <span className="text-gray-800 font-semibold text-sm text-right px-4">{value || '-'}</span>
        </div>
    );

    return (
        <div className="animate-fade-in-up">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex gap-4 items-start">
                <span className="text-3xl">📝</span>
                <div>
                    <h5 className="font-bold text-yellow-800">Final Review</h5>
                    <p className="text-sm text-yellow-700">Please review all details carefully before publishing. Once published, the product will be live on the marketplace.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info & Pricing */}
                <div className="space-y-6">
                    <Paper elevation={0} className="p-6 border border-gray-200 rounded-2xl">
                        <SectionHeader title="Basic Info" editIndex={0} />
                        <InfoRow label="Product Name" value={productData.name} />
                        <InfoRow label="Category" value={productData.categoryName || productData.categoryId} />
                        <InfoRow label="Material" value={productData.material} />
                        <InfoRow label="Color" value={productData.color} />
                        <InfoRow label="Size" value={productData.size} />
                        <InfoRow label="Origin" value={productData.origin} />
                        <InfoRow label="Pack Of" value={productData.packOf} />
                    </Paper>

                    <Paper elevation={0} className="p-6 border border-gray-200 rounded-2xl">
                        <SectionHeader title="Pricing & Stock" editIndex={1} />
                        <InfoRow label="MRP" value={`₹${productData.price}`} />
                        <InfoRow label="Selling Price" value={`₹${productData.discountPrice}`} />
                        <InfoRow label="Stock" value={productData.stockQuantity} />
                        <InfoRow label="Min Order" value={productData.minOrderQuantity} />
                        <InfoRow label="Max Order" value={productData.maxOrderQuantity} />
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500 font-medium text-sm">COD Available</span>
                            {productData.isCodAvailable ? <Chip label="Yes" color="success" size="small" /> : <Chip label="No" color="error" size="small" />}
                        </div>
                    </Paper>
                </div>

                {/* Right Column: Images, Specs, Policy */}
                <div className="space-y-6">
                    <Paper elevation={0} className="p-6 border border-gray-200 rounded-2xl">
                        <SectionHeader title="Images & Reel" editIndex={2} />
                        {productData.imageUrls && productData.imageUrls.length > 0 ? (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {productData.imageUrls.map((url, i) => (
                                    <img key={i} src={url} alt={`preview-${i}`} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No images uploaded</p>
                        )}

                        {productData.reelUrl && (
                            <div className="mt-4 border-t pt-4">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Product Reel</p>
                                <div className="w-24 aspect-[9/16] bg-black rounded-lg overflow-hidden shadow-sm">
                                    <video src={productData.reelUrl} className="w-full h-full object-cover" controls />
                                </div>
                            </div>
                        )}
                    </Paper>

                    <Paper elevation={0} className="p-6 border border-gray-200 rounded-2xl">
                        <SectionHeader title="Specifications" editIndex={3} />
                        {productData.specifications && productData.specifications.length > 0 ? (
                            productData.specifications.map((s, i) => (
                                <InfoRow key={i} label={s.key} value={s.value} />
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic">No specific attributes</p>
                        )}
                    </Paper>

                    <Paper elevation={0} className="p-6 border border-gray-200 rounded-2xl">
                        <SectionHeader title="Shipping Policy" editIndex={4} />
                        <InfoRow label="Dispatch In" value={`${productData.dispatchDays} Days`} />
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500 font-medium text-sm">Returns</span>
                            {productData.returnAvailable ? <Chip label="Allowed" color="success" size="small" /> : <Chip label="No" color="default" size="small" />}
                        </div>
                        {productData.returnAvailable && (
                            <InfoRow label="Window" value={`${productData.returnWindowDays} Days`} />
                        )}
                    </Paper>
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center bg-gray-800 text-white p-6 rounded-2xl shadow-xl">
                <div>
                    <h4 className="font-bold text-lg">Ready to Publish?</h4>
                    <p className="text-gray-400 text-sm">The product will be visible to customers immediately.</p>
                </div>
                <button
                    onClick={handlePublish}
                    disabled={submitLoading}
                    className={`px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-all transform hover:scale-105 shadow-2xl ${submitLoading ? 'bg-gray-600' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                >
                    {submitLoading ? 'Publishing...' : 'Publish Product'}
                </button>
            </div>
        </div>
    );
};
export default ReviewVerify;
