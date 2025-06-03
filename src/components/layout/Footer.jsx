import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B4F6C] text-[#EFF5FA] py-8 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="mb-4">
            <Link to="/" className="font-heading text-2xl font-bold mb-2 inline-block no-underline">
              <span className="text-white">Land</span>
              <span className="text-[#00B4D8]">Estate</span>
            </Link>
            <p className="text-[#AFC9DE] mb-3 max-w-[300px]">
              Revolutionizing real estate management with immersive 3D technology
            </p>
            <div className="flex gap-2">
              <a href="#" aria-label="Facebook" className="flex items-center justify-center w-9 h-9 bg-white bg-opacity-10 rounded-full text-white transition-all hover:bg-primary-500 hover:-translate-y-1">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Twitter" className="flex items-center justify-center w-9 h-9 bg-white bg-opacity-10 rounded-full text-white transition-all hover:bg-primary-500 hover:-translate-y-1">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="Instagram" className="flex items-center justify-center w-9 h-9 bg-white bg-opacity-10 rounded-full text-white transition-all hover:bg-primary-500 hover:-translate-y-1">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="LinkedIn" className="flex items-center justify-center w-9 h-9 bg-white bg-opacity-10 rounded-full text-white transition-all hover:bg-primary-500 hover:-translate-y-1">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white mb-3 text-lg">Quick Links</h4>
            <ul className="list-none p-0">
              <li className="mb-1"><Link to="/" className="text-[#AFC9DE] no-underline transition-colors hover:text-[#00B4D8]">Home</Link></li>
              <li className="mb-1"><Link to="/properties" className="text-[#AFC9DE] no-underline transition-colors hover:text-[#00B4D8]">Properties</Link></li>
              <li className="mb-1"><Link to="/about" className="text-[#AFC9DE] no-underline transition-colors hover:text-[#00B4D8]">About Us</Link></li>
              <li className="mb-1"><Link to="/contact" className="text-[#AFC9DE] no-underline transition-colors hover:text-[#00B4D8]">Contact</Link></li>
              <li className="mb-1"><Link to="/dashboard" className="text-[#AFC9DE] no-underline transition-colors hover:text-[#00B4D8]">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-3 text-lg">Services</h4>
            <ul className="list-none p-0">
              <li className="mb-1"><a href="#" className="text-[#AFC9DE] no-underline transition-colors hover:text-[#00B4D8]">Buying Property</a></li>
              <li className="mb-1"><a href="#" className="text-[#AFC9DE] no-underline transition-colors hover:text-[#00B4D8]">Selling Property</a></li>
              <li className="mb-1"><a href="#" className="text-[#AFC9DE] no-underline transition-colors hover:text-[#00B4D8]">Property Management</a></li>
              <li className="mb-1"><a href="#" className="text-[#AFC9DE] no-underline transition-colors hover:text-[#00B4D8]">Investment Consultation</a></li>
              <li className="mb-1"><a href="#" className="text-[#AFC9DE] no-underline transition-colors hover:text-[#00B4D8]">3D Property Tours</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-2 text-lg">Subscribe to our Newsletter</h4>
            <p className="text-[#AFC9DE] mb-3">Stay updated with our latest properties and offers</p>
            <form className="flex flex-col gap-2 sm:flex-row">
              <input 
                type="email" 
                placeholder="Your email address" 
                required 
                className="px-4 py-3 rounded-md border border-[#2D6B8E] bg-neutral-800 text-white text-sm"
              />
              <button 
                type="submit" 
                className="bg-[#00B4D8] text-white border-none px-4 py-3 rounded-md font-medium cursor-pointer transition-colors hover:bg[#33C3E0]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#1C5D7D] pt-4 flex flex-col gap-2 text-center lg:flex-row lg:justify-between lg:text-left">
          <p className="text-neutral-400 text-sm m-0">&copy; {currentYear} LandEstate. All rights reserved.</p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <a href="#" className="text-neutral-400 text-sm no-underline transition-colors hover:text-[#00B4D8]">Privacy Policy</a>
            <a href="#" className="text-neutral-400 text-sm no-underline transition-colors hover:text-[#00B4D8]">Terms of Service</a>
            <a href="#" className="text-neutral-400 text-sm no-underline transition-colors hover:text-[#00B4D8]">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;