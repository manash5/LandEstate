import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Loader from '../components/ui/Loader';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { resetPassword, verifyResetToken } from '../../services/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    const token = searchParams.get('token');
    const password = watch('password');

    console.log('ResetPassword component loaded');
    console.log('Token from URL:', token);

    useEffect(() => {
        console.log('useEffect running, checking token...');
        const checkToken = async () => {
            if (!token) {
                console.log('No token found in URL');
                toast.error('Invalid reset link', {
                    position: "bottom-right",
                    theme: "dark",
                    transition: Bounce,
                });
                navigate('/login');
                return;
            }

            try {
                console.log('Verifying token:', token);
                const response = await verifyResetToken(token);
                console.log('Token verification response:', response);
                setIsValidToken(true);
                setUserEmail(response.data.email);
                setIsLoading(false);
            } catch (error) {
                console.error('Token verification failed:', error);
                toast.error('Invalid or expired reset link', {
                    position: "bottom-right",
                    theme: "dark",
                    transition: Bounce,
                });
                navigate('/login');
            }
        };

        checkToken();
    }, [token, navigate]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await resetPassword({
                token,
                newPassword: data.password
            });

            toast.success('Password reset successfully!', {
                position: "bottom-right",
                autoClose: 5000,
                theme: "dark",
                transition: Bounce,
            });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Password reset error:', error);
            
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message || 'Invalid request', {
                    position: "bottom-right",
                    theme: "dark",
                    transition: Bounce,
                });
            } else {
                toast.error('Failed to reset password! Server error.', {
                    position: "bottom-right",
                    theme: "dark",
                    transition: Bounce,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isValidToken && !isLoading) {
        return null; // Will redirect in useEffect
    }

    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <Navbar />
            <div className="min-h-[100vh] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="w-full max-w-xl">
                        <div className="bg-white text-black shadow-xl p-8 transform transition-all duration-300 hover:shadow-3xl">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Your Password</h1>
                                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                                <p className="text-gray-600 mt-4">Enter your new password for {userEmail}</p>
                            </div>

                            {/* Reset Password Form */}
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-6">
                                    {/* New Password Input */}
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter new password"
                                            {...register("password", { 
                                                required: "Password is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Password must be at least 6 characters"
                                                }
                                            })}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                        {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
                                    </div>

                                    {/* Confirm Password Input */}
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm new password"
                                            {...register("confirmPassword", { 
                                                required: "Please confirm your password",
                                                validate: value => value === password || "Passwords do not match"
                                            })}
                                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                        {errors.confirmPassword && <span className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</span>}
                                    </div>

                                    {/* Reset Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                                Resetting...
                                            </div>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Back to Login Link */}
                            <div className="mt-8 text-center">
                                <span className="text-gray-600">Remember your password? </span>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ResetPassword;
