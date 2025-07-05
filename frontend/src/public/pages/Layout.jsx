import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Loader from '../components/ui/Loader';
import ScrollToTop from '../components/ui/ScrollToTop';
import Hero from '../components/home/Hero'
import Features from '../components/home/Features';
import PropertyShowcase from '../components/home/PropertyShowcase';
import Testimonials from '../components/home/Testimonials'; 
import UserRoles from '../components/home/UserRoles';

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