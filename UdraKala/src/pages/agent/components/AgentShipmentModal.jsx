import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { X, Phone, MapPin, Navigation, DollarSign, AlertCircle, ChevronRight, ScanLine, Lock, KeyRound } from "lucide-react";
import api from '../../../api/api';
import { verifyBarcode, sendOtp, verifyOtp, markDeliveryFailed, uploadProof } from '../../../api/agentApi';
import Swal from 'sweetalert2';
import AgentMap from "./AgentMap";
import BarcodeScannerModal from './BarcodeScannerModal';
import { TextField, Button, Box, CircularProgress, Typography } from '@mui/material';
import { UploadCloud } from 'lucide-react'; // Import Icon

const AgentShipmentModal = ({ isOpen, onClose, shipment }) => {
    const [activeTab, setActiveTab] = useState('details');
    const [qrValue, setQrValue] = useState(null);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false); // New State
    const [otpInput, setOtpInput] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);

    // Proof of Delivery State
    const [proofFile, setProofFile] = useState(null);
    const [proofPreview, setProofPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    // If barcode not verified, default to 'scan' tab (even if user clicks others, we lock them)
    // But better to have a 'scan' tab.

    const [localVerified, setLocalVerified] = useState(false); // New State

    // Derived state
    const isBarcodeVerified = shipment?.barcodeVerified || localVerified; // Check local state too

    useEffect(() => {
        if (!isBarcodeVerified) {
            setActiveTab('scan');
        } else if (activeTab === 'scan') {
            setActiveTab('details');
        }
    }, [isBarcodeVerified]);

    // Fetch QR if tab is payment AND verified
    useEffect(() => {
        if (activeTab === 'payment' && !qrValue && isBarcodeVerified) {
            api.post(`/logistics/shipments/${shipment.id}/payment/qr`)
                .then(res => setQrValue(res.data))
                .catch(err => console.error("Failed to fetch QR", err));
        }
    }, [activeTab, shipment.id, qrValue, isBarcodeVerified]);

    const handleMarkFailed = async () => {
        const { value: reason } = await Swal.fire({
            title: 'Mark Delivery Failed',
            input: 'select',
            inputOptions: {
                'Customer Unavailable': 'Customer Unavailable',
                'Wrong Address': 'Wrong Address',
                'Refused Delivery': 'Refused Delivery',
                'Other': 'Other'
            },
            inputPlaceholder: 'Select a reason',
            showCancelButton: true
        });

        if (reason) {
            try {
                await markDeliveryFailed(shipment.id, reason);
                Swal.fire('Updated', 'Shipment marked as failed', 'success');
                onClose();
            } catch (error) {
                Swal.fire('Error', 'Failed to update status', 'error');
            }
        }
    };

    const handleScan = async (barcode) => {
        setIsVerifying(true);
        try {
            await verifyBarcode(shipment.id, barcode);
            setIsScannerOpen(false);
            setLocalVerified(true); // Unlock locally
            setActiveTab('details'); // Switch to details
            Swal.fire({
                icon: 'success',
                title: 'Verified',
                text: 'Package matched successfully. Details unlocked.',
                timer: 1500,
                showConfirmButton: false
            });
            // Keeping modal open to show details
        } catch (error) {
            console.error(error);
            setIsScannerOpen(false); // Stop scanning to show alert
            Swal.fire('Error', error.response?.data?.message || 'Invalid Barcode', 'error');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleStartDelivery = async () => {
        setOtpLoading(true);
        try {
            await sendOtp(shipment.id);
            setOtpSent(true);
            Swal.fire('OTP Sent', 'OTP sent to customer email.', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to send OTP', 'error');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setOtpLoading(true);
        try {
            await verifyOtp(shipment.id, otpInput);
            Swal.fire({
                icon: 'success',
                title: 'OTP Verified',
                text: 'Please upload proof of delivery photo to complete.',
                timer: 2000,
                showConfirmButton: false
            });
            setIsOtpVerified(true); // Unlock Proof Upload
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Invalid OTP', 'error');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire('Error', 'File size exceeds 5MB', 'error');
                return;
            }
            setProofFile(file);
            setProofPreview(URL.createObjectURL(file));
        }
    };

    const clearProof = () => {
        setProofFile(null);
        setProofPreview(null);
    };

    const handleUploadProof = async () => {
        if (!proofFile) return;
        setUploading(true);
        try {
            await uploadProof(shipment.id, proofFile);
            Swal.fire('Success', 'Delivery Completed Successfully!', 'success');
            onClose();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to upload proof. Try again.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const tabs = [
        { id: 'scan', label: 'Scan', icon: ScanLine, hidden: isBarcodeVerified },
        { id: 'details', label: 'Details', icon: ChevronRight, disabled: !isBarcodeVerified },
        { id: 'contact', label: 'Contact', icon: Phone, disabled: !isBarcodeVerified },
        { id: 'navigate', label: 'Navigate', icon: MapPin, disabled: !isBarcodeVerified },
        { id: 'payment', label: 'Payment', icon: DollarSign, disabled: !isBarcodeVerified },
    ].filter(t => !t.hidden);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-bg-dark bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-bg-surface dark:bg-bg-dark rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-bg-dark text-text-onDark p-4 flex justify-between items-center shadow-lg">
                    <div>
                        <h2 className="text-lg font-bold">Manage Delivery</h2>
                        <p className="text-xs text-text-secondary">Order #{shipment.order.orderId || shipment.order.id}</p>
                    </div>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-onDark p-1 rounded-full hover:bg-bg-dark transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b dark:border-border overflow-x-auto bg-bg-page dark:bg-bg-dark/50">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            disabled={tab.disabled}
                            onClick={() => !tab.disabled && setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-2 text-sm font-medium flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-primary text-primary dark:text-primary'
                                : tab.disabled
                                    ? 'border-transparent text-text-secondary dark:text-text-secondary cursor-not-allowed'
                                    : 'border-transparent text-text-secondary dark:text-text-secondary hover:text-text-secondary'
                                }`}
                        >
                            <tab.icon size={18} />
                            <span className="text-xs">{tab.label}</span>
                        </button>
                    ))}
                    {isBarcodeVerified && (
                        <button
                            onClick={() => setActiveTab('return')}
                            className={`flex-1 py-3 px-2 text-sm font-medium flex flex-col items-center gap-1 border-b-2 border-transparent text-status-error hover:text-status-error`}
                        >
                            <AlertCircle size={18} />
                            <span className="text-xs">Return</span>
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-bg-surface dark:bg-bg-dark">

                    {/* SCAN TAB */}
                    {activeTab === 'scan' && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-8">
                            <div className="bg-primary-light dark:bg-primary-hover/30 p-6 rounded-full text-primary dark:text-primary">
                                <ScanLine size={48} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-text-primary dark:text-text-onDark">Scan to Unlock</h3>
                                <p className="text-text-secondary dark:text-text-secondary mt-2 text-sm">
                                    Customer details are hidden for security.<br />Scan the package barcode to verify.
                                </p>
                            </div>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => setIsScannerOpen(true)}
                                startIcon={<ScanLine />}
                                sx={{
                                    bgcolor: '#5747C7',
                                    '&:hover': { bgcolor: '#c2410c' },
                                    borderRadius: '12px',
                                    py: 1.5,
                                    px: 4,
                                    fontWeight: 'bold'
                                }}
                            >
                                Open Scanner
                            </Button>
                        </div>
                    )}

                    {/* DETAILS TAB */}
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            <div className="bg-bg-page dark:bg-bg-dark p-4 rounded-xl border border-border dark:border-border">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Status</label>
                                        <div className="mt-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${shipment.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                shipment.status === 'OUT_FOR_DELIVERY' ? 'bg-primary-light text-primary' :
                                                    'bg-primary-light text-primary'
                                                }`}>
                                                {shipment.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Payment</label>
                                        <div className="mt-1 font-medium text-text-primary dark:text-text-onDark">
                                            {shipment.order.paymentMode || 'COD'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Customer Details</label>
                                <div className="p-4 bg-bg-surface dark:bg-bg-dark border border-border dark:border-border rounded-lg shadow-sm">
                                    <h4 className="font-bold text-text-primary dark:text-text-onDark">{shipment.order.user.fullName}</h4>
                                    <p className="text-sm text-text-secondary dark:text-text-secondary mt-1">{shipment.order.shippingAddress}</p>
                                </div>
                            </div>

                            {/* Delivery Actions */}
                            {['OUT_FOR_DELIVERY', 'DISPATCHED', 'ASSIGNED'].includes(shipment.status) && (
                                <div className="pt-4 border-t dark:border-border space-y-4">
                                    {!otpSent ? (
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            onClick={handleStartDelivery}
                                            disabled={otpLoading}
                                            startIcon={<KeyRound />}
                                            sx={{
                                                bgcolor: '#16a34a',
                                                '&:hover': { bgcolor: '#15803d' },
                                                py: 1.5,
                                                borderRadius: '8px'
                                            }}
                                        >
                                            {otpLoading ? 'Sending OTP...' : 'Start Delivery (Send OTP)'}
                                        </Button>
                                    ) : !isOtpVerified ? (
                                        <div className="space-y-3 animation-fade-in">
                                            <Typography variant="subtitle2" className="text-center text-status-success font-bold">
                                                OTP Sent to Customer
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                label="Enter OTP"
                                                value={otpInput}
                                                onChange={(e) => setOtpInput(e.target.value)}
                                                variant="outlined"
                                                inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2em' } }}
                                            />
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size="large"
                                                onClick={handleVerifyOtp}
                                                disabled={otpLoading || otpInput.length < 6}
                                                sx={{ py: 1.5, borderRadius: '8px' }}
                                            >
                                                {otpLoading ? 'Verifying...' : 'Confirm Delivery'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 animation-fade-in border-t pt-4 dark:border-border">
                                            <Typography variant="subtitle2" className="text-center text-primary font-bold">
                                                OTP Verified! Upload Proof
                                            </Typography>

                                            <div className="flex flex-col items-center gap-4">
                                                {proofPreview ? (
                                                    <div className="relative w-full h-48 bg-bg-band rounded-lg overflow-hidden border-2 border-green-500">
                                                        <img src={proofPreview} alt="Proof" className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={clearProof}
                                                            className="absolute top-2 right-2 bg-status-error text-text-onDark p-1 rounded-full shadow hover:bg-status-error"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="outlined"
                                                        component="label"
                                                        fullWidth
                                                        sx={{ height: 100, borderStyle: 'dashed', borderRadius: 2 }}
                                                    >
                                                        <div className="flex flex-col items-center gap-2 text-text-secondary">
                                                            <UploadCloud size={24} />
                                                            <span>Click to Upload Delivery Photo</span>
                                                            <span className="text-xs text-text-secondary">Max 5MB (JPG, PNG)</span>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            hidden
                                                            accept="image/*"
                                                            onChange={handleFileSelect}
                                                        />
                                                    </Button>
                                                )}

                                                {proofFile && (
                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        size="large"
                                                        onClick={handleUploadProof}
                                                        disabled={uploading}
                                                        sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' }, py: 1.5 }}
                                                    >
                                                        {uploading ? 'Uploading...' : 'Complete Delivery'}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'contact' && isBarcodeVerified && (
                        <div className="space-y-4">
                            <a href={`tel:${shipment.order.user.phoneNumber || '9999999999'}`} className="flex items-center gap-4 p-4 border dark:border-border rounded-lg hover:bg-bg-page dark:hover:bg-bg-dark transition-colors">
                                <div className="bg-green-100 p-3 rounded-full text-status-success shadow-sm">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary dark:text-text-onDark">Call Customer</h3>
                                    <p className="text-sm text-text-secondary dark:text-text-secondary">{shipment.order.user.phoneNumber}</p>
                                </div>
                            </a>
                        </div>
                    )}

                    {activeTab === 'navigate' && isBarcodeVerified && (
                        <div className="space-y-4 h-[300px]">
                            <AgentMap shipmentId={shipment.id} />
                            <Button
                                href={`https://www.google.com/maps/dir/?api=1&destination=${shipment.shippingLatitude},${shipment.shippingLongitude}`}
                                target="_blank"
                                fullWidth
                                variant="outlined"
                                startIcon={<Navigation size={16} />}
                            >
                                Open in Google Maps
                            </Button>
                        </div>
                    )}

                    {activeTab === 'payment' && isBarcodeVerified && (
                        <div className="text-center space-y-6 py-6">
                            <div className="bg-bg-surface p-6 rounded-xl shadow-lg inline-block">
                                {qrValue ? (
                                    <QRCode value={qrValue} size={180} />
                                ) : (
                                    <div className="h-44 w-44 flex items-center justify-center bg-bg-band text-text-secondary">
                                        Loading...
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-lg font-bold text-text-primary dark:text-text-onDark font-mono tracking-wider">
                                    ₹{shipment.order.totalAmount}
                                </p>
                                <p className="text-sm text-text-secondary">Amount to Collect</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'return' && (
                        <div className="space-y-4 text-center py-6">
                            <AlertCircle size={48} className="text-status-error mx-auto" />
                            <h3 className="text-lg font-bold text-text-primary dark:text-text-onDark">Mark as Undelivered</h3>
                            <p className="text-sm text-text-secondary">Initiating a return will cancel this delivery attempt.</p>
                            <Button
                                onClick={handleMarkFailed}
                                color="error"
                                variant="contained"
                                fullWidth
                            >
                                Proceed with Return
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <BarcodeScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScan={handleScan}
                loading={isVerifying}
            />
        </div >
    );
};

export default AgentShipmentModal;
