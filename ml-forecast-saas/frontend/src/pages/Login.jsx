import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Shield, Zap, BarChart3, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SocialAuth from '../components/common/SocialAuth';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '', remember: false });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    const benefits = [
        { icon: BarChart3, text: '98.77% forecast accuracy' },
        { icon: Zap, text: 'Real-time predictions' },
        { icon: Shield, text: 'Enterprise-grade security' },
    ];

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Branding & Info */}
            <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-primary-600 to-secondary-700">
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl" />
                </div>

                {/* Header */}
                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-sm">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white font-display">
                            ForecastAI
                        </span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="relative z-10 max-w-sm">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl font-bold leading-tight mb-6 text-white font-display">
                            Welcome back to <br />
                            <span className="text-white/90">
                                smarter forecasting
                            </span>
                        </h1>
                        <p className="text-lg text-white/70 mb-10 leading-relaxed">
                            Access your dashboard to view predictions and optimize your supply chain with our advanced ML models.
                        </p>

                        <div className="space-y-5">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                        <benefit.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-medium text-white/90">{benefit.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Footer Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="relative z-10 flex items-center gap-6 text-sm font-medium text-white/60"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
                        99.9% Uptime
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success-400" />
                        SOC 2 Compliant
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[420px]"
                >
                    {/* Mobile Logo */}
                    <Link to="/" className="lg:hidden flex items-center gap-3 mb-10 justify-center">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 font-display">ForecastAI</span>
                    </Link>

                    <div className="mb-8 text-center sm:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 font-display mb-2">Sign in</h2>
                        <p className="text-gray-500">
                            Welcome back! Please enter your details.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl flex items-start gap-3 bg-error-50 border border-error-200 text-error-700">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Social Auth Buttons */}
                    <SocialAuth isLoading={isLoading} />

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@company.com"
                                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-12 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-12 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-primary-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign in <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
                            Sign up now
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
