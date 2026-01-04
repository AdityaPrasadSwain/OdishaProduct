import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { Loader2, MapPin, Navigation } from "lucide-react";
import api from "../../../api/api"; // Adjust import path as needed

const containerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "0.5rem",
};

// Default center (Bhubaneswar) if no location
const defaultCenter = {
    lat: 20.2961,
    lng: 85.8245,
};

const AgentMap = ({ shipmentId }) => {
    const [shipmentLocation, setShipmentLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [agentLocation, setAgentLocation] = useState(null);
    const [error, setError] = useState(null);

    // Load shipment locations from backend
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/logistics/shipments/${shipmentId}/location`);
                setShipmentLocation(response.data);
            } catch (err) {
                console.error("Failed to fetch location", err);
                setError("Could not load shipment locations.");
            } finally {
                setLoading(false);
            }
        };

        if (shipmentId) {
            fetchLocation();
        }
    }, [shipmentId]);

    // Track Agent Live Location
    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setAgentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (err) => console.error("Error watching position:", err),
                { enableHighAccuracy: true }
            );

            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64 bg-red-50 text-red-600 rounded-lg">
                <p>{error}</p>
            </div>
        );
    }

    // Markers
    const customerPos = shipmentLocation?.shippingLatitude
        ? { lat: shipmentLocation.shippingLatitude, lng: shipmentLocation.shippingLongitude }
        : null;

    const sellerPos = shipmentLocation?.sellerLatitude
        ? { lat: shipmentLocation.sellerLatitude, lng: shipmentLocation.sellerLongitude }
        : null;

    // Calculate center: Agent -> Customer -> Default
    const mapCenter = agentLocation || customerPos || defaultCenter;

    const openGoogleMaps = (destLat, destLng) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`, "_blank");
    };

    return (
        <div className="space-y-4">
            {/* Map Actions */}
            <div className="flex gap-2">
                {customerPos && (
                    <button
                        onClick={() => openGoogleMaps(customerPos.lat, customerPos.lng)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                    >
                        <Navigation size={16} />
                        Navigate to Customer
                    </button>
                )}
                {sellerPos && (
                    <button
                        onClick={() => openGoogleMaps(sellerPos.lat, sellerPos.lng)}
                        className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-700 transition"
                    >
                        <MapPin size={16} />
                        Navigate to Seller
                    </button>
                )}
            </div>

            {/* Map Container */}
            <div className="border border-gray-200 rounded-lg overflow-hidden relative">
                <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                    <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={13}>
                        {/* Agent Marker (Green) */}
                        {agentLocation && (
                            <Marker
                                position={agentLocation}
                                title="You (Agent)"
                                icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                            />
                        )}

                        {/* Customer Marker (Blue) */}
                        {customerPos && (
                            <Marker
                                position={customerPos}
                                title="Customer"
                                icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                            />
                        )}

                        {/* Seller Marker (Orange/Red) */}
                        {sellerPos && (
                            <Marker
                                position={sellerPos}
                                title="Seller"
                                icon="http://maps.google.com/mapfiles/ms/icons/orange-dot.png"
                            />
                        )}
                    </GoogleMap>
                </LoadScript>

                {/* API Key Warning Overlay (Remove in production if key is present) */}
                <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 opacity-80 pointer-events-none">
                    Dev Mode: Add API Key
                </div>
            </div>
        </div>
    );
};

export default AgentMap;
