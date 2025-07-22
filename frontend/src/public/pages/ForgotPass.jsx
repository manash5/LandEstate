import React, {useState, useEffect} from 'react';
import {useForm}  from 'react-hook-form';
import Navbar from '../components/layout/Navbar'
import Loader from '../components/ui/Loader'; 
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../services/api';

const ForgotPass = () => {
      const location = useLocation();
      const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async(data) => {
        setIsLoading(true);
            try {
              const response = await forgotPassword(data); 
        
              const result = response.data;
              console.log('Email submission response:', result);

              if (response.status === 200) {
                toast.success('Password reset email sent successfully!', {
                  position: "bottom-right",
                  autoClose: 5000,
                  theme: "dark",
                  transition: Bounce,
                });
              }
            } catch (error) {
              console.error('Forgot password error:', error);
              
              if (error.response && error.response.status === 404) {
                toast.error('No account found with this email address', {
                  position: "bottom-right",
                  theme: "dark",
                  transition: Bounce,
                });
              } else if (error.response && error.response.status === 400) {
                toast.error('Email is required', {
                  position: "bottom-right",
                  theme: "dark",
                  transition: Bounce,
                });
              } else {
                toast.error('Failed to send email! Server error.', {
                  position: "bottom-right",
                  theme: "dark",
                  transition: Bounce,
                });
              }
            } finally {
              setIsLoading(false);
            }
          };

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

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
                <Loader/>
            ): (
            <div className="w-full max-w-xl">
                <div className="bg-white text-black shadow-xl p-8 transform transition-all duration-300 hover:shadow-3xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Enter your email!</h1>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-6">
                            {/* Email Input */}
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter email address"
                                    {...register("email", { 
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
                                />
                                {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                        Sending...
                                    </div>
                                ) : (
                                    'Send Reset Email'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Register Link */}
                    <div className="mt-8 text-center">
                        <span className="text-gray-600">Don't have an account? </span>
                        <button
                            onClick={() => navigate('/register')}
                            className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200 hover:underline"
                        >
                            Register
                        </button>
                    </div>
                </div>
            </div>)}
        </div>
        </>
    )
}

export default ForgotPass
