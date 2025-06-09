import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Home, Users, Shield, TrendingUp, ChevronLeft, ChevronRight, Bath, Bed, Square } from 'lucide-react';


// Sample property data
const properties = [
  {
    id: 1,
    title: 'Modern Lakefront Villa',
    location: 'Lake Tahoe, California',
    price: 2500000,
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: true,
  },
  {
    id: 2,
    title: 'Downtown Luxury Apartment',
    location: 'Manhattan, New York',
    price: 1800000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: true,
  },
  {
    id: 3,
    title: 'Seaside Beach House',
    location: 'Malibu, California',
    price: 3200000,
    bedrooms: 5,
    bathrooms: 4,
    area: 4100,
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: false,
  },
  {
    id: 4,
    title: 'Mountain View Cabin',
    location: 'Aspen, Colorado',
    price: 950000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    image: 'https://images.pexels.com/photos/463996/pexels-photo-463996.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: false,
  },
];

const formatPrice = (price) => {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
};

const PropertyShowcase = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentProperty, setCurrentProperty] = useState(0);
  
  const filteredProperties = activeFilter === 'all' 
    ? properties 
    : properties.filter(property => property.featured);

    const nextProperty = () => {
    setCurrentProperty((prev) => (prev + 1) % Math.ceil(properties.length / 2));
  };

  const prevProperty = () => {
    setCurrentProperty((prev) => (prev - 1 + Math.ceil(properties.length / 2)) % Math.ceil(properties.length / 2));
  };

  return (
    <section className="pt-20 px-6  relative bg-[#111523] ">
      <button 
        onClick={prevProperty}
        className="absolute left-20 top-1/2 transform -translate-y-1/2  text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Featured <span className="text-cyan-400">Properties</span>
            </h2>
            <p className="text-xl text-slate-300">
              Discover handpicked premium properties from our exclusive collection
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {properties.slice(currentProperty * 2, currentProperty * 2 + 2).map((property) => (
                <div 
                  key={property.id}
                  className="group bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/20"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={property.image}
                      alt={property.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {property.type}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold group-hover:text-cyan-400 transition-colors duration-300">
                        {property.title}
                      </h3>
                      <span className="text-2xl font-bold text-cyan-400">
                        {property.price}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-400 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{property.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-300 border-t border-slate-700 pt-4">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1 text-cyan-400" />
                        <span>{property.beds} Beds</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1 text-cyan-400" />
                        <span>{property.baths} Baths</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1 text-cyan-400" />
                        <span>{property.sqft} sq ft</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            
            
            

            {/* View All Properties Button */}
            <div className="text-center mt-12">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 transform hover:scale-105">
                View All Properties
              </button>
            </div>
          </div>
        </div>
        <button 
              onClick={nextProperty}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
      </section>
  );
};

export default PropertyShowcase;