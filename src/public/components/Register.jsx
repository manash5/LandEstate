import React, {useState, useEffect} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from './layout/Navbar';
import metaLogo from '../../assets/meta.png'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
// import FacebookLogin from 'react-facebook-login';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';


const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm(); 

  const handleRegister = (data) => {
      setIsLoading(true);
      console.log(data); 
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/login');
      
      // Simulate registration process
      setTimeout(() => {
        setIsLoading(false);
        toast.success('Registration successful!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }, 1500);
    };

  const handleLogin = () => {
      setIsLoading(true);
      // Simulate login process
      setTimeout(() => {
        setIsLoading(false);
        alert('Login successful!');
      }, 1500);
    };
  
      
  
      
  
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
  
    const handleGoogleSuccess = (credentialResponse) => {
      console.log("Google Sign In Success:", credentialResponse);
      toast.success('Successfully Logged In with Google!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
      });
    };
  
    const handleGoogleError = () => {
      console.error("Google Sign In Failed");
      toast.error('Google Sign In Failed!', {
          position: "bottom-right",
          theme: "dark",
          transition: Bounce,
      });
    };
  
    
  
   

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login clicked!`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };


 
  const onSubmit = (data) => { 
    console.log(data); 
  };
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
    <Navbar name = 'Login'/>
    <div className="min-h-[100vh] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-white  text-black shadow-xl p-8 transform transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create your account</h1>
           
            <h5 className="text-xs  text-gray-800 mb-2">By signing up you have agreed to our
                 <span className='text-blue-500'> Privacy Policy </span> and 
                 <span className='text-blue-500'> Terms and Conditions  </span></h5>
          </div>
          
          <form onSubmit = {handleSubmit(handleRegister)} className="space-y-6">
          {/* Login Form */}
            <div className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
                />
                {errors.email && (
    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
  )}
              </div>

              {/* username input  */}
              <div className="relative">
                <input
                  type="text"
                  {...register("username", { required: "Username is required" })}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
                />
                {errors.username && (
    <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
  )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
  )}
              </div>

              {/* Login Button */}
              <button
                type = 'submit'
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <div className="relative w-full ">
              {/* Hidden Google Login */}
              <div className="absolute opacity-0 pointer-events-none w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>

              {/* Custom Button */}
              <button
                onClick={() => document.querySelector('[role="button"]').click()}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all"
              >
                {/* Google Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium">Continue with Google</span>
              </button>
            </div>

            <div className="relative w-full">
              {/* <FacebookLogin
                appId={import.meta.env.VITE_FACEBOOK_CLIENT_ID}
                autoLoad={false}
                fields="name,email,picture"
                onClick={componentClicked}
                callback={handleFacebookCallback}
                cssClass="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all"
                icon={<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>}
                textButton="Continue with Meta"
              /> */}
            </div>
          </div>

          
        </div>
      </div>
    </div>
    </>
  )
}

export default Register
