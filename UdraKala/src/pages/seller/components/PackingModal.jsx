
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-200 dark:border-gray-700 relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                    <X size={24} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-cyan-100 p-3 rounded-full text-cyan-600">
                        <Package size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold dark:text-white">Pack Order</h3>
                        <p className="text-sm text-gray-500">#{order.id.substring(0, 8)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Step 1: Invoice */}
                    <div className={`p-4 rounded-lg border flex items-center justify-between ${order.invoiceSent ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${order.invoiceSent ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm dark:text-gray-900">1. Send Invoice</h4>
                                <p className="text-xs text-gray-500">{order.invoiceSent ? 'Invoice Sent' : 'Required before packing'}</p>
                            </div>
                        </div>
                        {order.invoiceSent ? (
                            <CheckCircle className="text-green-600" size={24} />
                        ) : (
                            <button
                                onClick={handleSendInvoice}
                                disabled={loading}
                                className="px-3 py-1.5 bg-orange-600 text-white text-xs font-bold rounded hover:bg-orange-700 disabled:opacity-50"
                            >
                                Send Now
                            </button>
                        )}
                    </div>

                    {/* Step 2: Upload Packing Video */}
                    <div className={`p-4 rounded-lg border transition-colors ${videoUploaded ? 'bg-green-50 border-green-200' : (!order.invoiceSent ? 'opacity-50 bg-gray-50' : 'bg-white border-gray-200')}`}>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${videoUploaded ? 'bg-green-200 text-green-700' : 'bg-purple-100 text-purple-600'}`}>
                                        <Video size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm dark:text-gray-900">2. Upload Packing Video</h4>
                                        <p className="text-xs text-gray-500">{videoUploaded ? 'Video Uploaded' : 'Upload packing proof (MP4)'}</p>
                                    </div>
                                </div>
                                {videoUploaded && <CheckCircle className="text-green-600" size={24} />}
                            </div>

                            {!videoUploaded && order.invoiceSent && (
                                <div className="flex gap-2 items-center mt-1">
                                    <input
                                        type="file"
                                        accept="video/mp4"
                                        onChange={(e) => setVideoFile(e.target.files[0])}
                                        className="text-xs w-full text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    />
                                    <button
                                        onClick={handleVideoUpload}
                                        disabled={!videoFile || loading}
                                        className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                                        title="Upload Video"
                                    >
                                        <UploadCloud size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 3: Mark Packed */}
                    <div className={`p-4 rounded-lg border flex items-center justify-between ${(videoUploaded && order.invoiceSent) ? 'bg-white border-gray-200' : 'opacity-50 bg-gray-50'}`}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-100 text-cyan-600 rounded-full">
                                <Package size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm dark:text-white">3. Mark as Packed</h4>
                                <p className="text-xs text-gray-500">Dimensions & Check</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleMarkPacked}
                        disabled={!order.invoiceSent || !videoUploaded || loading}
                        className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-cyan-200 dark:shadow-none"
                    >
                        {loading ? 'Processing...' : 'Confirm Packed'}
                    </button>
                </div>
            </Motion.div>
        </div>
    );
};

export default PackingModal;
