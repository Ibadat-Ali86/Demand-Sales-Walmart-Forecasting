import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import SocialAuth from '../../components/common/SocialAuth';
import PasswordStrength from '../../components/auth/PasswordStrength';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';

const AuthPage = () => {
    const [activeMode, setActiveMode] = useState('signin');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        remember: false,
        terms: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    // Auth context
    const { login, register } = useAuth();
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear specific error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
        setApiError('');
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        // Email validation
        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        // Password validation
        if (activeMode === 'register') {
            const passError = validatePassword(formData.password);
            if (passError) newErrors.password = passError;

            // Name validation
            if (!validateRequired(formData.name)) newErrors.name = 'Full Name is required';

            // Terms validation
            if (!formData.terms) newErrors.terms = 'You must agree to the Terms of Service';
        } else {
            if (!formData.password) newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setApiError('');

        try {
            if (activeMode === 'signin') {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password);
            }

            // Navigate on success
            navigate('/dashboard');
        } catch (err) {
            console.error('Auth error:', err);
            setApiError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants
    const formVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md relative z-10">

                {/* Tab Switcher */}
                <div className="relative mb-8 p-1 bg-surface-default border border-border-default rounded-lg flex shadow-sm">
                    <motion.div
                        className="absolute top-1 bottom-1 bg-bg-tertiary rounded-md shadow-sm border border-border-secondary z-0"
                        initial={false}
                        animate={{
                            left: activeMode === 'signin' ? '4px' : '50%',
                            width: 'calc(50% - 4px)'
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />

                    <button
                        onClick={() => setActiveMode('signin')}
                        className={`flex-1 py-2.5 text-sm font-medium relative z-10 transition-colors ${activeMode === 'signin' ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary'
                            }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setActiveMode('register')}
                        className={`flex-1 py-2.5 text-sm font-medium relative z-10 transition-colors ${activeMode === 'register' ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary'
                            }`}
                    >
                        Register
                    </button>
                </div>

                {/* Header */}
                <motion.div
                    key={activeMode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h2 className="font-display text-3xl font-bold text-text-primary mb-2">
                        {activeMode === 'signin' ? 'Welcome back' : 'Start your journey'}
                    </h2>
                    <p className="text-text-secondary">
                        {activeMode === 'signin'
                            ? 'Enter your credentials to access your dashboard'
                            : 'Create your account to unlock intelligent forecasting'}
                    </p>
                </motion.div>

                {/* API Error Alert */}
                <AnimatePresence>
                    {apiError && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 overflow-hidden"
                        >
                            <div className="p-4 rounded-xl flex items-start gap-3 bg-red-50 border border-red-200 text-red-700">
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="text-sm">{apiError}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Social Login */}
                <SocialAuth isLoading={isLoading} />

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeMode}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={formVariants}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            {/* Sign In Fields */}
                            {activeMode === 'register' && (
                                <Input
                                    label="Full Name"
                                    name="name"
                                    icon={User}
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={errors.name}
                                    required
                                />
                            )}

                            <Input
                                label="Work Email"
                                name="email"
                                type="email"
                                icon={Mail}
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                required
                            />

                            <div>
                                <Input
                                    label="Password"
                                    name="password"
                                    type="password"
                                    icon={Lock}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    required
                                />
                                {activeMode === 'register' && (
                                    <div className="mt-2">
                                        <PasswordStrength password={formData.password} />
                                    </div>
                                )}
                            </div>

                            {activeMode === 'signin' ? (
                                <div className="flex items-center justify-between pt-1">
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={formData.remember}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-brand-600 border-border-default rounded focus:ring-brand-500 cursor-pointer"
                                        />
                                        <span className="ml-2 text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                                            Remember me
                                        </span>
                                    </label>
                                    <Link to="/forgot-password" className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-start pt-1">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="terms"
                                            checked={formData.terms}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-brand-600 border-border-default rounded focus:ring-brand-500 cursor-pointer"
                                            required
                                        />
                                    </div>
                                    <div className="ml-2 text-sm">
                                        <label className="text-text-secondary">
                                            I agree to the <Link to="/terms" className="text-brand-600 hover:text-brand-700 font-semibold">Terms of Service</Link> and <Link to="/privacy" className="text-brand-600 hover:text-brand-700 font-semibold">Privacy Policy</Link>
                                        </label>
                                        {errors.terms && (
                                            <p className="text-error-500 text-xs mt-1">{errors.terms}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-full justify-center"
                                    isLoading={isLoading}
                                    loadingText={activeMode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                                    icon={ArrowRight}
                                    iconPosition="right"
                                >
                                    {activeMode === 'signin' ? 'Sign In' : 'Create Account'}
                                </Button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-text-tertiary leading-relaxed">
                        By continuing, you agree to our Terms of Service and Privacy Policy.<br />
                        Protected by reCAPTCHA and subject to Google's Policy.
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
};

export default AuthPage;
