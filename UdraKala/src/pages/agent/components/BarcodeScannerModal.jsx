import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Button, Box, Typography, CircularProgress } from '@mui/material';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { X, RefreshCcw } from 'lucide-react';

const BarcodeScannerModal = ({ isOpen, onClose, onScan, loading }) => {
    const [error, setError] = useState(null);
    const [cameraActive, setCameraActive] = useState(true);

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}>
            <Box className="bg-gray-900 text-white p-4 flex justify-between items-center">
                <Typography variant="h6" fontWeight="bold">Scan Parcel Label</Typography>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
            </Box>

            <DialogContent className="bg-black p-0 relative" sx={{ minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                    <Box className="flex flex-col items-center gap-4 py-12">
                        <CircularProgress sx={{ color: '#ea580c' }} thickness={5} size={60} />
                        <Typography variant="h6" className="text-white animate-pulse">Verifying...</Typography>
                    </Box>
                ) : cameraActive ? (
                    <>
                        <Box sx={{ width: '100%', height: '300px', overflow: 'hidden', position: 'relative' }}>
                            <BarcodeScannerComponent
                                width={500}
                                height={300}
                                onUpdate={(err, result) => {
                                    if (result) {
                                        setCameraActive(false);
                                        onScan(result.text);
                                    }
                                    if (err) {
                                        // Commonly triggers on no-code-found, so ignoring noisy log
                                    }
                                }}
                            />
                            {/* Overlay Guidelines */}
                            <div className="absolute inset-0 border-2 border-orange-500 opacity-50 pointer-events-none" style={{ top: '10%', bottom: '10%', left: '10%', right: '10%' }}></div>
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 opacity-60 pointer-events-none"></div>
                        </Box>
                        <Typography variant="body2" className="text-gray-400 mt-4 mb-4 text-center">
                            Align the barcode within the frame
                        </Typography>
                    </>
                ) : (
                    <Box className="flex flex-col items-center gap-4 py-8">
                        <RefreshCcw className="text-orange-500 animate-spin" size={40} />
                        <Typography className="text-white">Processing...</Typography>
                    </Box>
                )}

                {error && (
                    <Box className="p-4 bg-red-900/50 text-red-200 w-full text-center">
                        {error}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BarcodeScannerModal;
