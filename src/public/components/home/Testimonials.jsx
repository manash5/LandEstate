import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Reeta Dhakal",
      role: "Home Buyer",
      location: "Kathmandu, Nepal",
      rating: 5,
      text: "The 3D visualization feature was a game-changer for me. I could tour properties from the comfort of my home and narrow down my choices before visiting in person. Saved me so much time!",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      color: "from-blue-500 to-cyan-400"
    },
    {
      id: 2,
      name: "Rajesh Sharma",
      role: "Property Investor",
      location: "Pokhara, Nepal",
      rating: 5,
      text: "LandEstate's market analytics helped me make informed investment decisions. The real-time data and trends analysis gave me the confidence to invest in the right properties at the right time.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      color: "from-green-500 to-emerald-400"
    },
    {
      id: 3,
      name: "Priya Thapa",
      role: "First-time Buyer",
      location: "Lalitpur, Nepal",
      rating: 5,
      text: "As a first-time buyer, I was overwhelmed by the process. LandEstate's intuitive interface and expert support made everything so simple. I found my dream home within weeks!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      color: "from-purple-500 to-pink-400"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setIsAutoPlaying(false);
    setCurrentTestimonial(index);
  };

  const currentData = testimonials[currentTestimonial];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-20 px-6">
      <button 
        onClick={prevTestimonial}
        className="absolute left-60 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-600 hover:text-slate-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border border-white/50"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            What Our{' '}
            <span className="bg-gradient-to-r from-cyan-600 to-cyan-400 bg-clip-text text-transparent">
              Clients
            </span>{' '}
            Say
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Real stories from real people who found their perfect property
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/50 overflow-hidden">
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentData.color} opacity-5 rounded-3xl`}></div>
            
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 opacity-10">
              <Quote className="w-16 h-16 text-slate-600" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Left Border Accent */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${currentData.color} rounded-full`}></div>
              
              <div className="pl-8">
                {/* Rating Stars */}
                <div className="flex mb-6">
                  {[...Array(currentData.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed font-medium">
                  "{currentData.text}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={currentData.image}
                      alt={currentData.name}
                      className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r ${currentData.color} rounded-full border-2 border-white`}></div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-slate-800">
                      {currentData.name}
                    </div>
                    <div className="text-cyan-600 font-medium">
                      {currentData.role}
                    </div>
                    <div className="text-slate-500 text-sm">
                      {currentData.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-lg"></div>
          </div>

          {/* Navigation Buttons */}
          
          
          
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center space-x-3 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`relative transition-all duration-300 ${
                index === currentTestimonial 
                  ? 'w-8 h-3' 
                  : 'w-3 h-3 hover:w-4'
              }`}
            >
              <div className={`w-full h-full rounded-full transition-all duration-300 ${
                index === currentTestimonial 
                  ? `bg-gradient-to-r ${currentData.color} shadow-lg` 
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}></div>
            </button>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">10,000+</div>
            <div className="text-slate-600">Happy Customers</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">4.9/5</div>
            <div className="text-slate-600">Average Rating</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">15 Days</div>
            <div className="text-slate-600">Average Find Time</div>
          </div>
        </div>
      </div>

      <button 
            onClick={nextTestimonial}
            className="absolute right-60 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-600 hover:text-slate-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border border-white/50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
    </div>
  );
};

export default Testimonials;