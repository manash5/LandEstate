import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';

const Navbar = (props) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

    useEffect(() => {
      setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(prev => !prev);
    };


  return (
    <header className= 'fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 bg-[#111523] px-40 ' >
      <div className="flex items-center justify-between w-[full] mx-auto px-4 ">
        <Link to="/" className="font-heading text-2xl font-bold  text-[#0B4F6C] flex items-center ">
          <span className="text-[#0F6D94] ">Land</span>
          <span className="text-[#00B4D8]">Estate</span>
        </Link>

        

        <div className="flex items-center gap-5 space-x-4">
          {props.name && props.name !== 'null' && (
            <Link 
              to={`/${props.name.toLowerCase()}`}
              className="hidden md:block bg-[#138BBC] text-white px-4 py-2 rounded-md font-medium
                      transform origin-center
                      transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
                      hover:scale-[1.04]  hover:text-white"
            >
              {props.name}
            </Link>
          )}
        </div>
      </div>

      
    </header>
  );
};

export default Navbar;