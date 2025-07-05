import React from 'react';
import { Search, BarChart3, Smartphone, Home } from 'lucide-react';

const LandEstateFeatures = () => {
  const features = [
    {
      icon: <Home className="w-8 h-8" />,
      title: "3D Property Visualization",
      description: "Experience properties in immersive 3D before visiting in person.",
      color: "from-orange-400 to-red-500"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Advanced Property Search",
      description: "Find your perfect property with our smart filters and recommendations.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Market Analytics",
      description: "Make informed decisions with real-time market data and trends.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Seamless Experience",
      description: "Manage properties easily across all your devices with our intuitive interface.",
      color: "from-purple-400 to-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Why Choose <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">LandEstate</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Discover the features that make us the leading platform for real estate management
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 overflow-hidden">
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                
                {/* Icon Container */}
                <div className="relative z-10 mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 bg-white/70 backdrop-blur-sm px-8 py-4 rounded-full border border-white/50 shadow-lg">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 border-2 border-white shadow-md"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 border-2 border-white shadow-md"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-white shadow-md"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 border-2 border-white shadow-md flex items-center justify-center text-white text-sm font-bold">
                +
              </div>
            </div>
            <div className="text-slate-700">
              <span className="font-semibold">10,000+</span> satisfied customers
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default LandEstateFeatures;