import React from 'react';
import { Clock } from 'lucide-react';

const PendingApproval = () => {
    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="bg-yellow-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Pending</h2>
            <p className="text-gray-600 mb-6">
                Your KYC details have been submitted successfully.
                Our team is reviewing your application.
            </p>
            <div className="bg-blue-50 p-4 rounded-md text-left">
                <h4 className="font-semibold text-blue-800 text-sm mb-2">What happens next?</h4>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                    <li>Admin verifies your documents (24-48 hours).</li>
                    <li>You will receive an email/notification upon approval.</li>
                    <li>Once approved, you can start listing products.</li>
                </ul>
            </div>
        </div>
    );
};

export default PendingApproval;
