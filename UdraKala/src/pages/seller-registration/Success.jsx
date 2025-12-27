import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
    const navigate = useNavigate();

    return (
        <div className="text-center py-10">
            <div className="flex justify-center mb-6">
                <CheckCircle className="text-green-500 w-24 h-24" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Registration Submitted!</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Seller Registration Submitted Successfully. Your account is now under review. You will be notified once approved.
            </p>

            <button
                onClick={() => navigate('/seller/dashboard')}
                className="px-8 py-3 bg-orange-600 text-white rounded-full font-bold shadow-lg hover:bg-orange-700 transition transform hover:-translate-y-1"
            >
                Go to Dashboard
            </button>
        </div>
    );
};

export default Success;
