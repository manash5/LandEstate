import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Layout from '../../public/pages/Layout';
import Login from '../../public/pages/Login'
import { ThemeProvider } from '../../context/ThemeContext';
import Register from '../../public/pages/Register';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from '../../private/components/dashboard';
import Properties from '../../private/components/properties';
import Table from '../../private/components/table';
import Layout1 from '../../private/components/layout';
import Profile from '../../private/components/Profile';
import Settings from '../../private/components/settings';
import Test from '../components/test';
import NavigateClick from '../components/AnalyzeClick';
import EmployeeDashboard from '../employee/components/dashboard'

const AppRoutes = () => {
  return (
    <ThemeProvider>
      <Routes>
        {/* Landing page without layout/navbar */}
        <Route path="/" element={<Layout />} />
        <Route path ='/login' element={<Login/>}/>
        <Route path ='/register' element={<Register/>}/>
        <Route path ='/dashboard' element={<Dashboard/>}/>
        <Route path = '/properties' element = {<Properties/>}/>
        <Route path = '/table' element = {<Table/>}/>
        <Route path = '/layout' element = {<Layout1/>}/>
        <Route path = '/profile' element = {<Profile/>}/>
        <Route path = '/settings' element = {<Settings/>}/>
        <Route path = '/Test' element = {<Test/>}/>
        <Route path="/property/:id" element={<NavigateClick />} />
        <Route path = 'employee/dashboard' element = {<EmployeeDashboard/>} />


        
      </Routes>
    </ThemeProvider>
  )
}

export default AppRoutes
