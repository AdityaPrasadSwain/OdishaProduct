import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">Something went wrong.</h1>
                    <p className="text-xl mb-8">The application crashed. Here is the error:</p>
                    <div className="bg-black/50 p-6 rounded border border-red-500/30 overflow-auto max-w-4xl w-full">
                        <p className="text-red-300 font-mono mb-4">{this.state.error && this.state.error.toString()}</p>
                        <pre className="text-gray-400 text-xs font-mono whitespace-pre-wrap">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-3 bg-indigo-600 rounded hover:bg-indigo-700 font-bold"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
