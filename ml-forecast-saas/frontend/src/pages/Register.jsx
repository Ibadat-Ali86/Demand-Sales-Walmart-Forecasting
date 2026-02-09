import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Mail, Lock, Eye, EyeOff, User, ArrowRight, AlertCircle, Check, X, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SocialAuth from '../components/common/SocialAuth';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', acceptTerms: false });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        setError('');
    };

    const getStrength = () => {
        const { password } = formData;
        let s = 0;
        if (password.length >= 8) s++;
        if (/[A-Z]/.test(password)) s++;
        if (/[a-z]/.test(password)) s++;
        if (/[0-9]/.test(password)) s++;
        if (/[^A-Za-z0-9]/.test(password)) s++;
        return s;
    };

    const strength = getStrength();
    const strengthColors = ['#EF4444', '#F59E0B', '#EAB308', '#3B82F6', '#10B981'];
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

    const requirements = [
        { label: '8+ characters', met: formData.password.length >= 8 },
        { label: 'Uppercase', met: /[A-Z]/.test(formData.password) },
        { label: 'Lowercase', met: /[a-z]/.test(formData.password) },
        { label: 'Number', met: /[0-9]/.test(formData.password) },
    ];

    const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
        if (!formData.acceptTerms) return setError('Please accept terms');

        setIsLoading(true);
        try {
            const result = await register({
                full_name: formData.name,
                email: formData.email,
                password: formData.password
            });

            if (result.success) {
                navigate('/login', { state: { message: 'Account created! Please sign in.' } });
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const benefits = [
        'No credit card required',
        '14-day free trial',
        'Cancel anytime',
        'Full feature access'
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-white/10 border border-white/20 text-white">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">14-Day Free Trial</span>
                        </div>

                        <h1 className="text-4xl font-bold leading-tight mb-6 text-white font-display">
                            Start your journey to <br />
                            <span className="text-white/90">
                                smarter forecasting
                            </span>
                        </h1>

                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="text-white/90">{benefit}</span>
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
                        GDPR Compliant
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success-400" />
                        256-bit Encryption
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[420px] py-8"
                >
                    {/* Mobile Logo */}
                    <Link to="/" className="lg:hidden flex items-center gap-3 mb-10 justify-center">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 font-display">ForecastAI</span>
                    </Link>

                    <div className="mb-8 text-center sm:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 font-display mb-2">Create account</h2>
                        <p className="text-gray-500">
                            Get started with your 14-day free trial.
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
                            <label className="text-sm font-medium text-gray-700">Full name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-12 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Work email</label>
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
                                    placeholder="Create password"
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

                            {formData.password && (
                                <div className="pt-2">
                                    <div className="flex gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="h-1 flex-1 rounded-full transition-all duration-300"
                                                style={{
                                                    background: i < strength ? strengthColors[strength - 1] : '#E5E7EB'
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {requirements.map((r, i) => (
                                            <div key={i} className="flex items-center gap-1.5 text-xs">
                                                {r.met ? (
                                                    <Check className="w-3 h-3 text-success-600" />
                                                ) : (
                                                    <X className="w-3 h-3 text-gray-400" />
                                                )}
                                                <span className={r.met ? 'text-success-600' : 'text-gray-500'}>
                                                    {r.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Confirm password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    className={`w-full bg-white border-2 rounded-xl px-12 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${formData.confirmPassword && !passwordsMatch
                                        ? 'border-error-400 focus:ring-error-500/20 focus:border-error-500'
                                        : 'border-gray-200 focus:ring-primary-500/20 focus:border-primary-500'
                                        }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-600">
                                I agree to the{' '}
                                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Terms</a>
                                {' '}and{' '}
                                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Privacy Policy</a>
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={isLoading || !formData.acceptTerms}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3.5 rounded-xl shadow-md shadow-primary-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Create account <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
                            Sign in
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
