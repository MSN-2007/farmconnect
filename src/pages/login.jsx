import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { Phone, ArrowRight, ShieldCheck, Sprout } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (phone.length < 10 || password.length < 6) {
            alert('Please check your inputs.');
            return;
        }

        setLoading(true);
        try {
            let success;
            if (isLogin) {
                success = await login(phone, password);
            } else {
                if (!name) {
                    alert('Please enter your name');
                    setLoading(false);
                    return;
                }
                // Default role 'farmer' for now
                success = await register(name, phone, password, 'farmer');
            }

            if (success) {
                navigate('/');
            } else {
                alert(isLogin ? 'Login failed. Check credentials.' : 'Registration failed.');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-nature-50 flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-[32px] shadow-xl overflow-hidden relative border border-nature-100">
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-32 bg-nature-600">
                    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-nature-500 rounded-full opacity-50"></div>
                </div>

                <div className="relative pt-8 pb-8 px-8">
                    <div className="bg-white w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center mb-6 mx-auto">
                        <Sprout className="h-10 w-10 text-nature-600" />
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-black text-nature-900">
                            {isLogin ? 'Welcome Back' : 'Join FarmConnect'}
                        </h1>
                        <p className="text-gray-500 font-medium text-sm">
                            {isLogin ? 'Login to access your farm dashboard' : 'Create an account to start your journey'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div className="animate-in fade-in slide-in-from-top-4">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-3">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-nature-500 rounded-2xl font-black text-lg outline-none transition-all"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-3">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="98765 43210"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-nature-500 rounded-2xl font-black text-lg outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 pl-3">Password</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-nature-500 rounded-2xl font-black text-lg outline-none transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-nature-800 text-white rounded-2xl font-black text-lg hover:bg-nature-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Login Securely' : 'Create Account')}
                            {!loading && <ArrowRight className="h-5 w-5" />}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm font-bold text-gray-500 hover:text-nature-700 transition-colors"
                        >
                            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
