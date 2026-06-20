import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-bg-page flex flex-col items-center justify-center p-4">
            <div className="bg-bg-surface p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-border">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-50 p-4 rounded-full">
                        <ShieldAlert className="w-12 h-12 text-status-error" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-text-primary mb-2">Access Denied</h1>
                <p className="text-text-secondary mb-8">
                    You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full flex items-center justify-center space-x-2 bg-bg-band hover:bg-bg-band text-text-secondary font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                    >
                        <ArrowLeft size={20} />
                        <span>Go Back</span>
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-primary hover:bg-primary-hover text-text-onDark font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
