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
        <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-text-secondary uppercase tracking-[2px] text-[10px]">{title}</h4>
            <button
                onClick={() => onEditStep(editIndex)}
                className="text-primary text-xs font-bold hover:text-primary bg-primary/10 px-4 py-1.5 rounded-full transition-all border border-primary/20"
            >
                Edit
            </button>
        </div>
    );

    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between py-2.5 border-b border-white/5 last:border-0 hover:bg-bg-surface/5 transition-colors px-2 rounded-lg -mx-2">
            <span className="text-text-secondary font-medium text-sm">{label}</span>
            <span className="text-text-secondary font-semibold text-sm text-right">{value || '-'}</span>
        </div>
    );

    return (
        <div className="animate-fade-in-up">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-8 flex gap-5 items-center">
                <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(123,97,255,0.5)]">✨</span>
                <div>
                    <h5 className="font-bold text-primary text-lg">Final Review</h5>
                    <p className="text-sm text-text-secondary">Your creation is almost ready. Review all details carefully before publishing to the "UdraKala" marketplace.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Basic Info & Pricing */}
                <div className="space-y-6">
                    <div className="p-6 border border-white/10 rounded-2xl bg-bg-surface/5 backdrop-blur-sm">
                        <SectionHeader title="Basic Info" editIndex={0} />
                        <InfoRow label="Product Name" value={productData.name} />
                        <InfoRow label="Category" value={productData.categoryName || productData.categoryId} />
                        <InfoRow label="Material" value={productData.material} />
                        <InfoRow label="Color" value={productData.color} />
                        <InfoRow label="Size" value={productData.size} />
                        <InfoRow label="Origin" value={productData.origin} />
                        <InfoRow label="Pack Of" value={productData.packOf} />
                    </div>

                    <div className="p-6 border border-white/10 rounded-2xl bg-bg-surface/5 backdrop-blur-sm">
                        <SectionHeader title="Pricing & Stock" editIndex={1} />
                        <InfoRow label="MRP" value={`₹${productData.price}`} />
                        <InfoRow label="Selling Price" value={`₹${productData.discountPrice}`} />
                        <div className="flex justify-between py-2.5 border-b border-white/5">
                            <span className="text-text-secondary font-medium text-sm">Stock</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${productData.stockQuantity > 0 ? 'bg-status-success/10 text-emerald-400' : 'bg-status-error/10 text-rose-400'}`}>
                                {productData.stockQuantity} Units
                            </span>
                        </div>
                        <InfoRow label="Min Order" value={productData.minOrderQuantity} />
                        <InfoRow label="Max Order" value={productData.maxOrderQuantity} />
                        <div className="flex justify-between py-2.5">
                            <span className="text-text-secondary font-medium text-sm">COD Available</span>
                            {productData.isCodAvailable ?
                                <Chip label="YES" sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontWeight: 700, fontSize: '0.65rem' }} size="small" /> :
                                <Chip label="NO" sx={{ bgcolor: 'rgba(244, 63, 94, 0.1)', color: '#F43F5E', fontWeight: 700, fontSize: '0.65rem' }} size="small" />
                            }
                        </div>
                    </div>
                </div>

                {/* Right Column: Images, Specs, Policy */}
                <div className="space-y-6">
                    <div className="p-6 border border-white/10 rounded-2xl bg-bg-surface/5 backdrop-blur-sm">
                        <SectionHeader title="Media Attachments" editIndex={2} />
                        {productData.imageUrls && productData.imageUrls.length > 0 ? (
                            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                                {productData.imageUrls.map((url, i) => (
                                    <div key={i} className="relative group flex-shrink-0">
                                        <img src={url} alt={`preview-${i}`} className="w-20 h-20 object-cover rounded-xl border border-white/10 group-hover:border-primary/50 transition-all" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-text-secondary italic">No images uploaded</p>
                        )}

                        {productData.reelUrl && (
                            <div className="mt-4 border-t border-white/5 pt-4">
                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2">Product Reel</p>
                                <div className="w-24 aspect-[9/16] bg-bg-dark rounded-xl overflow-hidden shadow-2xl border border-white/10">
                                    <video src={productData.reelUrl} className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border border-white/10 rounded-2xl bg-bg-surface/5 backdrop-blur-sm">
                        <SectionHeader title="Specifications" editIndex={3} />
                        {productData.specifications && productData.specifications.length > 0 ? (
                            productData.specifications.map((s, i) => (
                                <InfoRow key={i} label={s.key} value={s.value} />
                            ))
                        ) : (
                            <p className="text-sm text-text-secondary italic">No additional attributes</p>
                        )}
                    </div>

                    <div className="p-6 border border-white/10 rounded-2xl bg-bg-surface/5 backdrop-blur-sm">
                        <SectionHeader title="Shipping & Returns" editIndex={4} />
                        <InfoRow label="Dispatch Time" value={`${productData.dispatchDays} Days`} />
                        <div className="flex justify-between py-2.5 border-b border-white/5">
                            <span className="text-text-secondary font-medium text-sm">Returns</span>
                            {productData.returnAvailable ?
                                <Chip label="ALLOWED" sx={{ bgcolor: 'rgba(123, 97, 255, 0.1)', color: '#7B61FF', fontWeight: 700, fontSize: '0.65rem' }} size="small" /> :
                                <Chip label="NOT ALLOWED" sx={{ bgcolor: 'rgba(148, 163, 184, 0.1)', color: '#94A3B8', fontWeight: 700, fontSize: '0.65rem' }} size="small" />
                            }
                        </div>
                        {productData.returnAvailable && (
                            <InfoRow label="Return Window" value={`${productData.returnWindowDays} Days`} />
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 bg-bg-band p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -mr-32 -mt-32"></div>
                <div className="z-10">
                    <h4 className="font-bold text-text-primary text-xl">Ready to Publish?</h4>
                    <p className="text-text-secondary text-sm">The product will be live on UdraKala immediately after publishing.</p>
                </div>
                <button
                    onClick={handlePublish}
                    disabled={submitLoading}
                    className={`z-10 px-10 py-4 rounded-xl font-bold uppercase tracking-widest transition-all transform hover:scale-105 shadow-xl ${submitLoading ? 'bg-bg-band cursor-not-allowed' : 'bg-bg-dark text-text-onDark hover:bg-bg-dark w-full md:w-auto'}`}
                >
                    {submitLoading ? 'Publishing...' : 'Confirm & Publish'}
                </button>
            </div>
        </div>
    );
};
export default ReviewVerify;
