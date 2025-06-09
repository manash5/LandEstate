import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Loader from '../ui/Loader';
import ScrollToTop from '../ui/ScrollToTop';
import Hero from '../home/Hero'
import Features from '../home/Features';
import PropertyShowcase from '../home/PropertyShowcase';
import Testimonials from '../home/Testimonials'; 
import UserRoles from '../home/UserRoles';

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

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
    <div className='min-h-[100vh] flex flex-col'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Navbar name= "Login"/>
          <main className='flex flex-col'>
            <Hero/>
            <Features/>
            <PropertyShowcase/>
            <UserRoles/>
            <Testimonials/>
            <Outlet />
          </main>
          <Footer />    
          <ScrollToTop />
        </>
      )}
    </div>
  );
};

export default Layout;