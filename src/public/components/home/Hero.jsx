import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Scene from '../3d/Scene';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxStyle = {
    transform: `translateY(${scrollY * 0.5}px)`,
  };

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden" style={{ background: 'linear-gradient(135deg, #111523, #111523)' }} ref={heroRef}>
      <div className="relative flex flex-col w-full h-full pt-20 z-10 md:flex-row md:items-center md:pl-8">
        <motion.div 
          className="flex-1 flex flex-col justify-center px-4 md:px-0 max-w-full z-[2] md:max-w-1/2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.2] mb-12 text-white">
            Discover Your Perfect <span className="text-[#00B4D8]">Property</span>
          </h1>
          <p className="text-lg md:text-xl text-[#DFEAF5] mb-8 max-w-[600px]">
            Explore real estate like never before without brookers and seamless management
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <Link to="/properties" className="btn btn-primary hover:bg-cyan-900 text-white px-8 py-3 rounded-lg font-semibold transform origin-center
                    transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
                    hover:scale-[1.04] hover:text-white min-w-[160px] text-center no-underline">
              Explore Properties
            </Link>
            <Link to="/dashboard" className="bg-white font-bold flex justify-center items-center rounded-md px-8 py-2 text-cyan-900 hover:bg-gray-100 transform origin-center
                    transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
                    hover:scale-[1.04]  hover:text-cyan-900">
              Sell Your Property
            </Link>
          </div>
          <div className="flex flex-wrap gap-8 mt-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold font-heading text-[#0F6D94]">500+</span>
              <span className="text-sm text-[#DFEAF5]">Properties</span>
            </div>
            <div className="flex flex-col ">
              <span className="font-bold font-heading text-2xl  text-[#0F6D94]">200+</span>
              <span className="text-sm text-[#DFEAF5]">Happy Clients</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold font-heading text-[#0F6D94]">50+</span>
              <span className="text-sm text-[#DFEAF5]">Cities</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute md:relative top-0 right-0 w-full h-full z-[1] md:flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={parallaxStyle}
        >
          <Scene />
        </motion.div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-gray-600 text-sm z-10 mb-10">
        <span className='text-white'>Scroll To Explore</span>
        <motion.div 
          className="mt-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          
        </motion.div>
        <motion.div
            className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center p-1"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div className="w-1 h-2 bg-gray-300 rounded-full" />
          </motion.div>
      </div>
    </section>
  );
};

export default Hero;