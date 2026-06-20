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
            <Box className="bg-bg-dark text-text-onDark p-4 flex justify-between items-center">
                <Typography variant="h6" fontWeight="bold">Scan Parcel Label</Typography>
                <button onClick={onClose} className="text-text-secondary hover:text-text-onDark">
                    <X size={24} />
                </button>
            </Box>

            <DialogContent className="bg-bg-dark p-0 relative" sx={{ minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {loading ? (
                    <Box className="flex flex-col items-center gap-4 py-12">
                        <CircularProgress sx={{ color: '#5747C7' }} thickness={5} size={60} />
                        <Typography variant="h6" className="text-text-onDark animate-pulse">Verifying...</Typography>
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
                            <div className="absolute inset-0 border-2 border-primary opacity-50 pointer-events-none" style={{ top: '10%', bottom: '10%', left: '10%', right: '10%' }}></div>
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-status-error opacity-60 pointer-events-none"></div>
                        </Box>
                        <Typography variant="body2" className="text-text-secondary mt-4 mb-4 text-center">
                            Align the barcode within the frame
                        </Typography>
                    </>
                ) : (
                    <Box className="flex flex-col items-center gap-4 py-8">
                        <RefreshCcw className="text-primary animate-spin" size={40} />
                        <Typography className="text-text-onDark">Processing...</Typography>
                    </Box>
                )}

                {error && (
                    <Box className="p-4 text-status-error/50 text-status-error w-full text-center">
                        {error}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default BarcodeScannerModal;
