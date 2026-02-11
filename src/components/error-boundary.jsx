import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // In production, send this to a logging service like Sentry
        console.error("CRITICAL UI ERROR:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
                    <div className="bg-white rounded-[40px] p-12 shadow-2xl border border-red-100 max-w-xl w-full">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <AlertTriangle className="h-10 w-10 text-red-600" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-4">Something went wrong</h1>
                        <p className="text-gray-600 font-bold mb-10 leading-relaxed">
                            A critical system error occurred. We've logged the incident and our engineering team is investigating.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 px-8 py-4 bg-nature-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-nature-800 transition-all shadow-lg active:scale-95"
                            >
                                <RefreshCw className="h-5 w-5" /> Reload App
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex-1 px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95"
                            >
                                <Home className="h-5 w-5" /> Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
