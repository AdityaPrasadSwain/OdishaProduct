import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AdminErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-page dark:bg-bg-dark p-6">
          <div className="max-w-md w-full bg-bg-surface dark:bg-bg-surface-dark border border-border dark:border-white/10 rounded-2xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary dark:text-text-onDark mb-3">
              Something went wrong
            </h2>
            <p className="text-text-secondary dark:text-gray-400 mb-8 text-sm">
              We encountered an unexpected error while loading this admin module. 
              Please try refreshing the page.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={this.handleReset} className="flex items-center gap-2">
                <RefreshCw size={18} />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;
