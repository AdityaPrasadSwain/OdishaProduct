
import React, { useState } from 'react';
import { motion as Motion } from 'motion/react';
import Swal from 'sweetalert2';
import { Package, FileText, CheckCircle, X, Video, UploadCloud } from 'lucide-react';
import { sendSellerInvoice, markPacked, uploadPackingVideo } from '../../../api/orderApi';

const PackingModal = ({ isOpen, onClose, order, onOrderUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [videoUploaded, setVideoUploaded] = useState(false);

    if (!isOpen || !order) return null;

    const handleSendInvoice = async () => {
        try {
            setLoading(true);
            await sendSellerInvoice(order.id);
            Swal.fire('Sent!', 'Invoice sent to customer.', 'success');
            onOrderUpdated(); // To refresh order status (invoiceSent: true)
        } catch (error) {
            Swal.fire('Error', 'Failed to send invoice', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleVideoUpload = async () => {
        if (!videoFile) return;
        try {
            setLoading(true);
            await uploadPackingVideo(order.id, videoFile);
            setVideoUploaded(true);
            Swal.fire('Success', 'Packing video uploaded!', 'success');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data || 'Failed to upload video', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkPacked = async () => {
        try {
            setLoading(true);
            await markPacked(order.id);
            Swal.fire('Packed!', 'Order marked as PACKED.', 'success');
            onOrderUpdated();
            onClose();
        } catch (error) {
            Swal.fire('Error', error.response?.data || 'Failed to mark as packed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/50 backdrop-blur-sm">
            <Motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-bg-surface dark:bg-bg-dark rounded-2xl w-full max-w-md p-6 shadow-xl border border-border dark:border-border relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-secondary hover:text-text-secondary dark:text-text-secondary"
                >
                    <X size={24} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-cyan-100 p-3 rounded-full text-cyan-600">
                        <Package size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold dark:text-text-onDark">Pack Order</h3>
                        <p className="text-sm text-text-secondary">#{order.id.substring(0, 8)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Step 1: Invoice */}
                    <div className={`p-4 rounded-lg border flex items-center justify-between ${order.invoiceSent ? 'bg-green-50 border-green-200' : 'bg-bg-page border-border'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${order.invoiceSent ? 'bg-green-200 text-green-700' : 'bg-bg-band text-text-secondary'}`}>
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm dark:text-text-primary">1. Send Invoice</h4>
                                <p className="text-xs text-text-secondary">{order.invoiceSent ? 'Invoice Sent' : 'Required before packing'}</p>
                            </div>
                        </div>
                        {order.invoiceSent ? (
                            <CheckCircle className="text-status-success" size={24} />
                        ) : (
                            <button
                                onClick={handleSendInvoice}
                                disabled={loading}
                                className="px-3 py-1.5 bg-primary text-text-onDark text-xs font-bold rounded hover:bg-primary-hover disabled:opacity-50"
                            >
                                Send Now
                            </button>
                        )}
                    </div>

                    {/* Step 2: Upload Packing Video */}
                    <div className={`p-4 rounded-lg border transition-colors ${videoUploaded ? 'bg-green-50 border-green-200' : (!order.invoiceSent ? 'opacity-50 bg-bg-page' : 'bg-bg-surface border-border')}`}>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${videoUploaded ? 'bg-green-200 text-green-700' : 'bg-purple-100 text-purple-600'}`}>
                                        <Video size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm dark:text-text-primary">2. Upload Packing Video</h4>
                                        <p className="text-xs text-text-secondary">{videoUploaded ? 'Video Uploaded' : 'Upload packing proof (MP4)'}</p>
                                    </div>
                                </div>
                                {videoUploaded && <CheckCircle className="text-status-success" size={24} />}
                            </div>

                            {!videoUploaded && order.invoiceSent && (
                                <div className="flex gap-2 items-center mt-1">
                                    <input
                                        type="file"
                                        accept="video/mp4"
                                        onChange={(e) => setVideoFile(e.target.files[0])}
                                        className="text-xs w-full text-text-secondary file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    />
                                    <button
                                        onClick={handleVideoUpload}
                                        disabled={!videoFile || loading}
                                        className="p-2 bg-purple-600 text-text-onDark rounded hover:bg-purple-700 disabled:opacity-50"
                                        title="Upload Video"
                                    >
                                        <UploadCloud size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 3: Mark Packed */}
                    <div className={`p-4 rounded-lg border flex items-center justify-between ${(videoUploaded && order.invoiceSent) ? 'bg-bg-surface border-border' : 'opacity-50 bg-bg-page'}`}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-100 text-cyan-600 rounded-full">
                                <Package size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm dark:text-text-onDark">3. Mark as Packed</h4>
                                <p className="text-xs text-text-secondary">Dimensions & Check</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleMarkPacked}
                        disabled={!order.invoiceSent || !videoUploaded || loading}
                        className="w-full py-3 bg-cyan-600 text-text-onDark font-bold rounded-xl hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-cyan-200 dark:shadow-none"
                    >
                        {loading ? 'Processing...' : 'Confirm Packed'}
                    </button>
                </div>
            </Motion.div>
        </div>
    );
};

export default PackingModal;
