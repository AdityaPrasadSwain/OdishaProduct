import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-50 p-4 rounded-full">
                        <ShieldAlert className="w-12 h-12 text-red-500" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-500 mb-8">
                    You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                    >
                        <ArrowLeft size={20} />
                        <span>Go Back</span>
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/30"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
