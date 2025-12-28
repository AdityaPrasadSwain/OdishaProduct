import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const AiAssistButton = ({ onClick, label = "AI Assist", loadingLabel = "Generating...", className = "" }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async (e) => {
        e.preventDefault(); // Prevent form submission if inside a form
        if (loading) return;

        setLoading(true);
        try {
            await onClick();
        } catch (error) {
            console.error("AI Action failed", error);
            // Optionally trigger a toast error here
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
            title="Generate with AI"
        >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {loading ? loadingLabel : label}
        </button>
    );
};

export default AiAssistButton;
