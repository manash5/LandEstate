import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from '../../public/pages/Layout';
import Login from '../../public/pages/Login'
import { ThemeProvider } from '../../context/ThemeContext';
import { MessageProvider } from '../../context/MessageContext';
import Register from '../../public/pages/Register';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from '../../private/components/dashboard';
import Properties from '../../private/components/properties';
import Table from '../../private/components/table';
import Layout1 from '../../private/pages/layout';
import Profile from '../../private/components/Profile';
import Settings from '../../private/components/settings';
import Test from '../components/test';
import NavigateClick from '../components/AnalyzeClick';
import EmployeeLayout from '../employee/pages/layout'
import EmployeeLogin from '../../public/pages/EmployeeLogin';
import ForgotPass from '../../public/pages/ForgotPass';
import ResetPassword from '../../public/pages/ResetPassword';
import Message from '../components/message';
import { checkUserAuth, checkEmployeeAuth } from '../../services/api';

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    // Define protected user routes
    const userProtectedRoutes = ['/dashboard', '/properties', '/table', '/layout', '/profile', '/settings', '/messages', '/Test', '/property'];
    
    // Define protected employee routes
    const employeeProtectedRoutes = ['/employee/layout', '/employee/dashboard'];
    
    // Check if current route is protected
    const isUserProtectedRoute = userProtectedRoutes.some(route => 
      location.pathname.startsWith(route)
    );
    
    const isEmployeeProtectedRoute = employeeProtectedRoutes.some(route => 
      location.pathname.startsWith(route)
    );
    
    // Perform authentication checks
    if (isUserProtectedRoute) {
      checkUserAuth();
    } else if (isEmployeeProtectedRoute) {
      checkEmployeeAuth();
    }
  }, [location.pathname]);
  return (
    <ThemeProvider>
      <MessageProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/forgotpass' element={<ForgotPass/>} />
          <Route path='/reset-password' element={<ResetPassword/>} />
          <Route path='/employee/login' element={<EmployeeLogin/>} />
          
          {/* User protected routes */}
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/properties' element={<Properties/>}/>
          <Route path='/table' element={<Table/>}/>
          <Route path='/layout' element={<Layout1/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/settings' element={<Settings/>}/>
          <Route path='/messages' element={<Message/>}/>
          <Route path='/messages/:userId' element={<Message/>}/>
          <Route path='/Test' element={<Test/>}/>
          <Route path="/property/:id" element={<NavigateClick />} />
          
          {/* Employee protected routes */}
          <Route path='/employee/layout' element={<EmployeeLayout/>} />
          <Route path='/employee/dashboard' element={<EmployeeLayout/>} />
        </Routes>
      </MessageProvider>
    </ThemeProvider>
  )
}

export default AppRoutes
