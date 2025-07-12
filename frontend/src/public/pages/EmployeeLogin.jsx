import React, {useState, useEffect} from 'react';
import {useForm}  from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/layout/Navbar'
import Loader from '../components/ui/Loader'; 

import { toast, Bounce } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { log } from 'three/tsl';
import { getLoggedIn } from '../../services/api';

const EmployeeLogin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async(data) => {
        setIsLoading(true);
            try {
              const response = await getLoggedIn(data); 
        
              const result = response.data;
              console.log(result?.['access_token'])
              localStorage.setItem("token",result?.['data']?.['access_token'])

        
              if (response) {
                toast.success('Registration successful!', {
                  position: "bottom-right",
                  autoClose: 5000,
                  theme: "dark",
                  transition: Bounce,
                });
                navigate('/layout');
              } else {
                toast.error(result.message || 'Registration failed!', {
                  position: "bottom-right",
                  theme: "dark",
                  transition: Bounce,
                });
              }
            } catch (error) {
              toast.error('Registration failed! Server error.', {
                position: "bottom-right",
                theme: "dark",
                transition: Bounce,
              });
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
    
        useEffect(() => {
            // Add loading when route changes
            if (!isLoading) {
                setIsLoading(true);
                const timer = setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
    
                return () => clearTimeout(timer);
            }
        }, [location.pathname]);

    return (
        <>
        <Navbar name = "null"/>
        <div className="min-h-[100vh] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
            {isLoading ? (
                <Loader/>
            ): (
            <div className="w-full max-w-xl">
                <div className="bg-white text-black shadow-xl p-8 transform transition-all duration-300 hover:shadow-3xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back, Employee!</h1>
                        <div className="w-20 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
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

                            {/* Password Input */}
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter password"
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

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                        Logging in...
                                    </div>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </div>
                    </form>

                    
                </div>
            </div>)}
        </div>
        </>
    )
}

export default EmployeeLogin; 
