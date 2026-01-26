import React, { useState, useEffect } from 'react';
import { shiprocketApi } from '../../api/shiprocketApi';

// Component to display tracking status
const TrackingStatus = ({ awb, currentStatus }) => {
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const fetchTracking = async () => {
        if (!awb) return;
        setLoading(true);
        setError(null);
        try {
            const data = await shiprocketApi.trackOrder(awb);
            // Shiprocket response structure: { tracking_data: { track_status: 1, ... } }
            // Or data might be the whole response body depending on API wrapper.
            // Adjust based on your API response.
            if (data && data.tracking_data) {
                setTrackingData(data.tracking_data);
            } else if (data && data.data) {
                // Sometime wrapped in data
                setTrackingData(data.data);
            } else {
                setTrackingData(data);
            }
        } catch (err) {
            setError("Failed to fetch tracking details.");
        } finally {
            setLoading(false);
        }
    };

    const toggleTracking = () => {
        if (!isOpen) fetchTracking();
        setIsOpen(!isOpen);
    };

    if (!awb) return <span className="text-gray-400 text-sm">Not Shipped</span>;

    return (
        <div className="mt-2">
            <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                    ${currentStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        currentStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'}`}>
                    {currentStatus || 'Processing'}
                </span>
                <button
                    onClick={toggleTracking}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium underline"
                >
                    {isOpen ? 'Hide Tracking' : 'Track Order'}
                </button>
            </div>

            {isOpen && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                    {loading && <p>Loading tracking info...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {trackingData && (
                        <div className="space-y-2">
                            <p><strong>Status:</strong> {trackingData.current_status || 'N/A'}</p>
                            <p><strong>Location:</strong> {trackingData.current_location || 'N/A'}</p>
                            <p><strong>Expected Delivery:</strong> {trackingData.etd || 'N/A'}</p>
                            {/* Render scans timeline if available */}
                            {trackingData.scans && (
                                <div className="mt-2 pl-2 border-l-2 border-orange-200">
                                    {trackingData.scans.slice(0, 3).map((scan, idx) => (
                                        <div key={idx} className="mb-2">
                                            <p className="text-xs text-gray-500">{scan.date} {scan.time}</p>
                                            <p className="text-gray-700">{scan.activity} - {scan.location}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TrackingStatus;
