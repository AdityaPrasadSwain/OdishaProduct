import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Camera, Upload, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8086/api';

const DeliveryAgentUploadProof = () => {
    const { user } = useAuth();
    const [mode, setMode] = useState(null); // 'camera' or 'upload' or null
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);

    const webcamRef = useRef(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
        // Convert base64 to blob/file
        fetch(imageSrc)
            .then(res => res.blob())
            .then(blob => {
                const myFile = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
                setFile(myFile);
            });
    }, [webcamRef]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImage(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file || !orderId) {
            Swal.fire('Error', 'Please provide Order ID and an Image', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('orderId', orderId);
        formData.append('agentId', user.id);
        formData.append('file', file);

        try {
            setLoading(true);
            // Use axios directly, or auth axios wrapper if available. using standard axios import here but usually api/axios.js
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            };

            await axios.post(`${API_URL}/agent/proof/upload`, formData, config);

            Swal.fire('Success', 'Proof uploaded successfully!', 'success');
            // Reset
            setImage(null);
            setFile(null);
            setOrderId('');
            setMode(null);

        } catch (error) {
            console.error(error);
            Swal.fire('Error', error.response?.data || 'Upload failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white dark:bg-dark-card rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-dark dark:text-light">Upload Delivery Proof</h2>

            {/* Order ID Input */}
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Order ID (UUID)</label>
                <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Enter Order ID"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary dark:bg-dark-input dark:border-gray-600"
                />
            </div>

            {/* Mode Selection */}
            {!image && (
                <div className="flex gap-4 justify-center mb-6">
                    <button
                        onClick={() => setMode('camera')}
                        className={`flex flex-col items-center p-4 border-2 rounded-lg transition-colors ${mode === 'camera' ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary'}`}
                    >
                        <Camera size={32} className="mb-2 text-primary" />
                        <span className="font-semibold">Use Camera</span>
                    </button>
                    <button
                        onClick={() => setMode('upload')}
                        className={`flex flex-col items-center p-4 border-2 rounded-lg transition-colors ${mode === 'upload' ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary'}`}
                    >
                        <Upload size={32} className="mb-2 text-primary" />
                        <span className="font-semibold">Upload Photo</span>
                    </button>
                </div>
            )}

            {/* Camera View */}
            {mode === 'camera' && !image && (
                <div className="mb-6 flex flex-col items-center">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full rounded-lg mb-4"
                        videoConstraints={{ facingMode: "environment" }}
                    />
                    <button onClick={capture} className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition">
                        Capture Photo
                    </button>
                </div>
            )}

            {/* File Upload View */}
            {mode === 'upload' && !image && (
                <div className="mb-6">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-primary file:text-white
                                hover:file:bg-primary-dark"
                    />
                </div>
            )}

            {/* Preview */}
            {image && (
                <div className="mb-6 relative">
                    <img src={image} alt="Preview" className="w-full rounded-lg shadow-sm" />
                    <button
                        onClick={() => { setImage(null); setFile(null); }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-md"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}

            {/* Submit Button */}
            {image && (
                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all
                        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'}
                    `}
                >
                    {loading ? 'Uploading...' : 'Confirm & Upload Proof'}
                </button>
            )}
        </div>
    );
};

export default DeliveryAgentUploadProof;
