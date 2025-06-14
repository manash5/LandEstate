import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './public/components/layout/Layout';
import Login from './public/components/Login'
import { ThemeProvider } from './context/ThemeContext';
import Register from './public/components/Register';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './private/components/Dashboard';
import Properties from './private/components/properties';
import Table from './private/components/table';
import Layout1 from './private/components/Layout';
import Profile from './private/components/Profile';
import Settings from './private/components/settings';

function App() {

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


        
      </Routes>
    </ThemeProvider>
  )
}

export default App
