import React, { useState, useEffect } from 'react';

const UserRoles = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    
    <section className="relative min-h-screen bg-[#111523] overflow-hidden py-20">
        <hr className=" mb-20 border-t border-slate-100/15" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '1s' }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/3 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '0.5s' }}
        ></div>
      </div>

      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.02\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div 
          className={`text-center max-w-4xl mx-auto mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative inline-block mb-6">
            <h2 className="text-6xl md:text-7xl font-black bg-gradient-to-r bg-white bg-clip-text text-transparent leading-tight">
              Choose <span className='text-cyan-700'>Your Path</span>
            </h2>
          </div>
          
          <p className="text-xl text-gray-600 font-light tracking-wide">
            Whether you're looking to buy or sell, we have the cutting-edge tools to transform your real estate journey
          </p>
        </div>

        <div 
          className={`grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div
            onMouseEnter={() => setHoveredCard('buyers')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
          >
            <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl blur transition-opacity duration-1000 ${
              hoveredCard === 'buyers' ? 'opacity-20' : 'opacity-10'
            }`}></div>
            
            <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl overflow-hidden h-full shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
              
              <div className="p-8 lg:p-12 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900">For Buyers</h3>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-8 flex-grow">
                  Discover your dream property with AI-powered search tools and immersive 3D experiences that revolutionize how you explore real estate.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    "Explore properties in photorealistic 3D detail",
                    "AI-powered search that understands your preferences",
                    "Instant notifications for your perfect matches",
                    "Virtual tours that save time and travel"
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 transition-all duration-500 ${
                        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      }`}
                      style={{ transitionDelay: `${(index + 1) * 150}ms` }}
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-cyan-400/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group-hover:shadow-2xl">
                  Start Your Journey
                  <svg className="inline ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>

              <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-cyan-400/8 to-blue-500/8 rounded-full blur-2xl"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-blue-400/8 to-purple-500/8 rounded-full blur-xl"></div>
            </div>
          </div>

          <div
            onMouseEnter={() => setHoveredCard('sellers')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
          >
            <div className={`absolute -inset-1 bg-gradient-to-r from-orange-400 to-pink-500 rounded-3xl blur transition-opacity duration-1000 ${
              hoveredCard === 'sellers' ? 'opacity-20' : 'opacity-10'
            }`}></div>
            
            <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-3xl overflow-hidden h-full shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-pink-500"></div>
              
              <div className="p-8 lg:p-12 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v2H8V5z" />
                    </svg>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900">For Sellers</h3>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-8 flex-grow">
                  Showcase your property with next-generation 3D visualization and reach qualified buyers through our premium marketing platform.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    "Create cinematic 3D tours that wow buyers",
                    "Access our network of verified, qualified buyers",
                    "Real-time analytics and viewing insights",
                    "Secure offer management and negotiations"
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 transition-all duration-500 ${
                        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      }`}
                      style={{ transitionDelay: `${(index + 1) * 150}ms` }}
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-orange-400/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group-hover:shadow-2xl">
                  List Your Property
                  <svg className="inline ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>

              <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-orange-400/8 to-pink-500/8 rounded-full blur-2xl"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-pink-400/8 to-purple-500/8 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        <div 
          className={`text-center mt-20 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
        </div>
      </div>
    </section>
    </>
  );
};

export default UserRoles;