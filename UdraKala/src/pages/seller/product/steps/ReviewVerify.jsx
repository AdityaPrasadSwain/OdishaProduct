import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getProductSummary } from '../../../../api/productWizardApi';

const ReviewVerify = ({ productId, onEditStep, onSubmit }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await getProductSummary(productId);
                setSummary(data);
            } catch (err) {
                console.error(err);
                Swal.fire('Error', "Failed to load summary: " + err.message, 'error');
            } finally {
                setLoading(false);
            }
        };
        if (productId) fetchSummary();
    }, [productId]);

    if (loading) return <div className="text-center py-20 animate-pulse text-text-secondary dark:text-text-secondary">Loading Summary...</div>;
    if (!summary) return <div className="text-center py-20 text-status-error">Error loading product details.</div>;

    const Section = ({ title, stepIndex, children }) => (
        <div className="bg-bg-page dark:bg-bg-dark rounded-xl p-6 border border-border dark:border-border relative group transition-colors">
            <h3 className="text-lg font-bold text-text-primary dark:text-text-onDark mb-4 border-b dark:border-border pb-2">{title}</h3>
            <button
                onClick={() => onEditStep(stepIndex)}
                className="absolute top-4 right-4 text-sm text-primary dark:text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
            >
                Edit
            </button>
            <div className="space-y-3 text-sm text-text-secondary dark:text-text-secondary">
                {children}
            </div>
        </div>
    );

    const Row = ({ label, value }) => (
        <div className="flex justify-between items-start">
            <span className="font-semibold text-text-secondary dark:text-text-secondary">{label}:</span>
            <span className="text-text-primary dark:text-text-onDark font-medium text-right max-w-[60%]">{value || '-'}</span>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section title="Basic Info" stepIndex={0}>
                    <Row label="Name" value={summary.name} />
                    <Row label="Category" value={summary.categoryName || 'Unknown'} />
                    <Row label="Material" value={summary.material} />
                    <Row label="Color" value={summary.color} />
                    <Row label="Size" value={summary.size} />
                    <Row label="Origin" value={summary.origin} />
                </Section>

                <Section title="Pricing & Stock" stepIndex={1}>
                    <Row label="MRP" value={`₹${summary.price}`} />
                    <Row label="Selling Price" value={`₹${summary.discountPrice}`} />
                    <Row label="Stock" value={summary.stockQuantity} />
                    <Row label="Min Order" value={summary.minOrderQuantity} />
                    <Row label="Max Order" value={summary.maxOrderQuantity} />
                    <Row label="COD Available" value={summary.codAvailable ? 'Yes' : 'No'} />
                </Section>

                <Section title="Images" stepIndex={2}>
                    <div className="grid grid-cols-4 gap-2">
                        {summary.imageUrls && summary.imageUrls.length > 0 ? (
                            summary.imageUrls.map((url, i) => (
                                <img key={i} src={url} alt="" className="w-16 h-16 object-cover rounded-lg border dark:border-border" />
                            ))
                        ) : (
                            <span className="text-text-secondary dark:text-text-secondary italic">No images uploaded</span>
                        )}
                    </div>
                </Section>

                <Section title="Specifications" stepIndex={3}>
                    {summary.specifications && summary.specifications.length > 0 ? (
                        summary.specifications.map((spec, i) => (
                            <Row key={i} label={spec.key} value={spec.value} />
                        ))
                    ) : (
                        <span className="text-text-secondary dark:text-text-secondary italic">No specifications added</span>
                    )}
                </Section>
            </div>

            <Section title="Shipping & Policy" stepIndex={4}>
                <Row label="Dispatch Time" value={`${summary.dispatchDays} Days`} />
                <Row label="Returns" value={summary.returnAvailable ? `Yes (${summary.returnWindowDays} Days)` : 'No Returns'} />
                {summary.returnAvailable && <Row label="Return Policy" value={summary.returnPolicyDescription} />}
                <Row label="Cancellations" value={summary.cancellationAvailable ? 'Allowed' : 'Not Allowed'} />
            </Section>

            <div className="flex justify-end pt-8">
                <button
                    onClick={onSubmit}
                    className="px-12 py-4 rounded-xl font-bold text-lg text-text-onDark shadow-xl shadow-green-200 dark:shadow-green-900 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all transform hover:-translate-y-1"
                >
                    Verify & Publish Product
                </button>
            </div>
        </div>
    );
};
export default ReviewVerify;
