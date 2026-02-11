import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/auth-context';

const DeveloperLogin = () => {
    const navigate = useNavigate();
    const { loginDeveloper, isDeveloper } = useAuth();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isDeveloper()) {
            navigate('/developer-dashboard');
        }
    }, [isDeveloper, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const result = loginDeveloper(credentials.username, credentials.password);

            // Artificial delay for UX
            await new Promise(r => setTimeout(r, 800));

            if (result) {
                setSuccess('Developer access granted! Redirecting...');
                setTimeout(() => {
                    navigate('/developer-dashboard');
                }, 1000);
            } else {
                setError('Invalid credentials. Check your Developer ID.');
            }
        } catch (err) {
            setError('Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-nature-900 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-nature-600 rounded-full mb-4">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Developer Access</h1>
                    <p className="text-gray-400">FarmConnect Admin Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Developer ID
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    placeholder="DEV.01@FARMCONNECT"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    placeholder="Enter password"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <p className="text-sm text-green-700">{success}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-nature-700 text-white rounded-lg font-semibold hover:bg-nature-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Access Developer Portal'}
                        </button>
                    </form>

                    {/* Info */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Developer Permissions:</h3>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Add & Manage Shops</li>
                            <li>• Manage Users & Content</li>
                            <li>• View Analytics & Reports</li>
                            <li>• System Settings & Configuration</li>
                            <li>• Database & API Management</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        ← Back to FarmConnect
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeveloperLogin;
