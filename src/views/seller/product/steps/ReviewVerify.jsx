import React, { useEffect, useState } from 'react';
import { getProductSummary } from '../../../../api/productWizardApi';

const ReviewVerify = ({ productId, onEditStep, onSubmit }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await getProductSummary(productId);
                setData(res);
            } catch (err) {
                alert("Failed to load summary: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [productId]);

    const handlePublish = async () => {
        setSubmitting(true);
        await onSubmit();
        setSubmitting(false);
    };

    if (loading) return <div className="text-center py-10">Loading summary...</div>;
    if (!data) return <div className="text-center py-10 text-red-500">Error loading data.</div>;

    const Section = ({ title, stepIndex, children }) => (
        <div className="mb-6 border border-gray-100 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center border-b border-gray-100">
                <h4 className="font-bold text-gray-700">{title}</h4>
                <button
                    onClick={() => onEditStep(stepIndex)}
                    className="text-blue-600 text-sm font-semibold hover:underline"
                >
                    Edit
                </button>
            </div>
            <div className="p-6 bg-white">
                {children}
            </div>
        </div>
    );

    const Row = ({ label, value }) => (
        <div className="flex justify-between py-1 border-b border-gray-50 last:border-0">
            <span className="text-gray-500 text-sm">{label}</span>
            <span className="text-gray-800 font-medium text-sm text-right">{value || '-'}</span>
        </div>
    );

    return (
        <div className="animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Review Product Details</h3>

            <Section title="Basic Information" stepIndex={0}>
                <Row label="Name" value={data.name} />
                <Row label="Category" value={data.categoryName || 'N/A'} />
                <Row label="Description" value={data.description} />
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <Row label="Material" value={data.material} />
                    <Row label="Color" value={data.color} />
                    <Row label="Size" value={data.size} />
                    <Row label="Origin" value={data.origin} />
                    <Row label="Pack Of" value={data.packOf} />
                </div>
            </Section>

            <Section title="Pricing & Stock" stepIndex={1}>
                <Row label="MRP" value={`₹${data.price}`} />
                <Row label="Selling Price" value={`₹${data.discountPrice}`} />
                <Row label="Stock" value={data.stockQuantity} />
                <Row label="Min Order" value={data.minOrderQuantity} />
                <Row label="Max Order" value={data.maxOrderQuantity} />
                <Row label="COD Available" value={data.isCodAvailable ? 'Yes' : 'No'} />
            </Section>

            <Section title="Images" stepIndex={2}>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {data.imageUrls && data.imageUrls.map((url, i) => (
                        <img key={i} src={url} className="w-20 h-20 object-cover rounded-lg border border-gray-200" alt="" />
                    ))}
                </div>
            </Section>

            <Section title="Specifications" stepIndex={3}>
                {data.specifications && data.specifications.map((spec, i) => (
                    <Row key={i} label={spec.key} value={spec.value} />
                ))}
            </Section>

            <Section title="Shipping Policy" stepIndex={4}>
                <Row label="Dispatch Days" value={data.dispatchDays} />
                <Row label="Return Available" value={data.returnAvailable ? 'Yes' : 'No'} />
                {data.returnAvailable && (
                    <>
                        <Row label="Return Window" value={`${data.returnWindowDays} Days`} />
                        <Row label="Return Policy" value={data.returnPolicyDescription} />
                    </>
                )}
                <Row label="Cancellation" value={data.cancellationAvailable ? 'Yes' : 'No'} />
            </Section>

            <div className="flex justify-end pt-6">
                <button
                    onClick={handlePublish}
                    disabled={submitting}
                    className={`px-10 py-3 rounded-xl font-bold text-white shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1 ${submitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {submitting ? 'Publishing...' : 'Verify & Publish'}
                </button>
            </div>
        </div>
    );
};

export default ReviewVerify;
