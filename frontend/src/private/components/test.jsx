import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ChevronDown, Home, TrendingUp, Shield, Users, Star, Play, ArrowRight, Sparkles, Award, MapPin } from 'lucide-react';
import * as THREE from 'three';

// Enhanced 3D House Component with more visual appeal
const ModernHouse = ({ position, rotation, scale, color = "#FFFFFF" }) => {
  const houseRef = useRef();
  
  useFrame((state) => {
    if (houseRef.current) {
      houseRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
      houseRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });
  
  return (
    <group ref={houseRef} position={position} rotation={rotation} scale={scale}>
      {/* Foundation with glow effect */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[6, 0.3, 6]} />
        <meshPhysicalMaterial 
          color="#1e293b"
          roughness={0.1}
          metalness={0.3}
          emissive="#0f172a"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Main Structure with premium materials */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[5, 4, 5]} />
        <meshPhysicalMaterial 
          color={color}
          roughness={0.05}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          reflectivity={0.9}
        />
      </mesh>
      
      {/* Glowing glass walls */}
      <mesh position={[0, 2, 2.51]} castShadow>
        <planeGeometry args={[4, 3]} />
        <meshPhysicalMaterial 
          color="#06b6d4"
          roughness={0}
          metalness={0.1}
          transmission={0.95}
          thickness={0.3}
          opacity={0.9}
          transparent
          emissive="#06b6d4"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Premium roof with gradient effect */}
      <mesh position={[0, 4.2, 0]} castShadow>
        <boxGeometry args={[5.4, 0.3, 5.4]} />
        <meshPhysicalMaterial 
          color="#0891b2"
          roughness={0.1}
          metalness={0.8}
          emissive="#0891b2"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Accent details with neon glow */}
      <mesh position={[-2.5, 1.5, 0]} castShadow>
        <boxGeometry args={[0.15, 3, 2]} />
        <meshPhysicalMaterial 
          color="#0ea5e9"
          roughness={0.1}
          metalness={0.9}
          emissive="#0ea5e9"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Additional luxury details */}
      <mesh position={[2.5, 1.5, 0]} castShadow>
        <boxGeometry args={[0.15, 3, 2]} />
        <meshPhysicalMaterial 
          color="#06b6d4"
          roughness={0.1}
          metalness={0.9}
          emissive="#06b6d4"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
};

// Enhanced 3D Scene with cinematic lighting
const Scene3D = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [12, 8, 15], fov: 35 }}
      className="w-full h-full"
    >
      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 20, 35]} />
      
      {/* Multiple houses with different colors for visual variety */}
      <ModernHouse 
        position={[0, 0, 0]} 
        rotation={[0, Math.PI / 5, 0]} 
        scale={1} 
        color="#f8fafc"
      />
      <ModernHouse 
        position={[-8, 0, -5]} 
        rotation={[0, Math.PI / 3, 0]} 
        scale={0.7} 
        color="#e2e8f0"
      />
      <ModernHouse 
        position={[7, 0, -3]} 
        rotation={[0, -Math.PI / 4, 0]} 
        scale={0.8} 
        color="#cbd5e1"
      />
      <ModernHouse 
        position={[0, 0, -10]} 
        rotation={[0, Math.PI / 6, 0]} 
        scale={0.6} 
        color="#94a3b8"
      />
      
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.3} color="#1e293b" />
      <directionalLight
        position={[15, 20, 10]}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Accent lights for atmosphere */}
      <pointLight position={[10, 5, 5]} intensity={0.8} color="#06b6d4" />
      <pointLight position={[-10, 5, 5]} intensity={0.8} color="#0ea5e9" />
      <pointLight position={[0, 10, -10]} intensity={1.2} color="#0891b2" />
      
      <Environment preset="night" />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2.5}
      />
    </Canvas>
  );
};

// Floating particles background
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Animated Counter
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          let start = 0;
          const increment = end / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, isVisible]);

  return <span ref={countRef}>{count.toLocaleString()}{suffix}</span>;
};

// Enhanced scroll animation hook
const useScrollAnimation = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
};

// Main Landing Page Component
const test = () => {
  const scrollY = useScrollAnimation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
      {/* Enhanced Navigation */}
      <nav className="fixed top-0 w-full bg-white/5 backdrop-blur-2xl z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Home className="h-10 w-10 text-cyan-400" />
                <div className="absolute inset-0 h-10 w-10 text-cyan-400 animate-pulse" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Landestate
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              {['Home', 'Properties', 'Services', 'About', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-white/80 hover:text-cyan-400 transition-all duration-300 font-medium relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Enhanced Visuals */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <FloatingParticles />
        
        <div className="absolute inset-0 w-full h-full">
          <Scene3D />
        </div>
        
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 via-transparent to-slate-900/20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div 
            className="transform transition-all duration-1000"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
              opacity: Math.max(0, 1 - scrollY / 1000)
            }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 mb-8">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="text-white/90 font-medium">Luxury Real Estate Redefined</span>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="text-white">Discover Your</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-pulse">
                Perfect Home
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience the future of real estate with our AI-powered platform, 
              stunning 3D visualizations, and personalized property matching.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-10 py-5 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/30 relative overflow-hidden">
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Explore Properties</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <button className="group flex items-center space-x-3 text-white border-2 border-white/30 hover:border-cyan-400 px-10 py-5 rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                <div className="relative">
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-cyan-400/30 rounded-full animate-ping" />
                </div>
                <span className="text-lg font-semibold">Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 text-white/60" />
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="services" className="py-32 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-cyan-500/10 backdrop-blur-md rounded-full px-6 py-3 border border-cyan-500/20 mb-8">
              <Award className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-medium">Premium Features</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Why Choose 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"> Landestate?</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing real estate with cutting-edge technology, personalized service, 
              and unmatched expertise in luxury property markets.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="w-16 h-16 text-cyan-400" />,
                title: "AI-Powered Analytics",
                description: "Advanced machine learning algorithms analyze market trends, predict property values, and identify the best investment opportunities for maximum returns.",
                gradient: "from-cyan-500/20 to-blue-500/20"
              },
              {
                icon: <Shield className="w-16 h-16 text-blue-400" />,
                title: "Blockchain Security",
                description: "Military-grade encryption and blockchain technology ensure your transactions are completely secure, transparent, and immutable.",
                gradient: "from-blue-500/20 to-purple-500/20"
              },
              {
                icon: <Users className="w-16 h-16 text-purple-400" />,
                title: "Expert Concierge",
                description: "Dedicated luxury real estate specialists provide white-glove service, from initial consultation to closing and beyond.",
                gradient: "from-purple-500/20 to-pink-500/20"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`group relative bg-gradient-to-br ${feature.gradient} p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-white/10 backdrop-blur-sm overflow-hidden`}
                style={{
                  transform: `translateY(${Math.max(0, (scrollY - 800) * 0.1)}px)`,
                  opacity: Math.max(0.3, 1 - Math.max(0, scrollY - 1200) / 400)
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-24 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 relative overflow-hidden">

        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: 15000, suffix: '+', label: 'Luxury Properties', icon: <Home className="w-8 h-8 mb-4 text-white/80" /> },
              { number: 50000, suffix: '+', label: 'Happy Clients', icon: <Users className="w-8 h-8 mb-4 text-white/80" /> },
              { number: 2500, suffix: 'M+', label: 'Properties Sold', icon: <TrendingUp className="w-8 h-8 mb-4 text-white/80" /> },
              { number: 99, suffix: '%', label: 'Client Satisfaction', icon: <Star className="w-8 h-8 mb-4 text-white/80" /> }
            ].map((stat, index) => (
              <div key={index} className="text-white group">
                <div className="flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-lg text-white/90 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-32 bg-gradient-to-b from-slate-800 to-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Client Success Stories
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Discover how we've helped thousands find their perfect luxury properties
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Tech Executive",
                location: "Beverly Hills, CA",
                content: "The 3D virtual tours and AI recommendations were absolutely game-changing. Found my dream penthouse without leaving my office!",
                rating: 5,
                image: "SJ"
              },
              {
                name: "Michael Chen",
                role: "Investment Fund Manager",
                location: "Manhattan, NY",
                content: "Landestate's market analytics helped me build a $50M portfolio. The ROI predictions were spot-on, exceeding all expectations.",
                rating: 5,
                image: "MC"
              },
              {
                name: "Emily Rodriguez",
                role: "Celebrity Designer",
                location: "Malibu, CA",
                content: "Moving from NYC to LA was seamless with their concierge service. The attention to detail and luxury focus is unmatched.",
                rating: 5,
                image: "ER"
              }
            ].map((testimonial, index) => (
              <div key={index} className="group bg-gradient-to-br from-white/10 to-white/5 p-8 rounded-3xl backdrop-blur-md border border-white/10 hover:border-cyan-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10">
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 mb-8 text-lg leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-lg">{testimonial.name}</div>
                    <div className="text-sm text-white/60">{testimonial.role}</div>
                    <div className="flex items-center space-x-1 text-sm text-cyan-400">
                      <MapPin className="w-3 h-3" />
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-cyan-900/20 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10" />
        <FloatingParticles />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 backdrop-blur-md rounded-full px-6 py-3 border border-cyan-500/20 mb-8">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-medium">Ready to Begin?</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Your Dream Property
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Awaits You
            </span>
          </h2>
          
          <p className="text-xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Join the elite circle of satisfied clients who discovered their perfect luxury properties 
            through our innovative platform and personalized service.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-12 py-6 rounded-full text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/30 relative overflow-hidden">
              <span className="relative z-10 flex items-center space-x-3">
                <span>Start Your Journey</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            
            <button className="border-2 border-white/30 text-white hover:border-cyan-400 hover:text-cyan-400 px-12 py-6 rounded-full text-xl font-semibold transition-all duration-300 backdrop-blur-sm hover:bg-white/5">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-black text-white py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <Home className="h-10 w-10 text-cyan-400" />
                  <div className="absolute inset-0 h-10 w-10 text-cyan-400 animate-pulse opacity-50" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Landestate
                </span>
              </div>
              <p className="text-white/70 text-lg leading-relaxed mb-6 max-w-md">
                Pioneering the future of luxury real estate through innovative technology, 
                exceptional service, and unmatched expertise.
              </p>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <div key={social} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-cyan-500/20 transition-colors cursor-pointer">
                    <span className="text-sm font-medium">{social[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-6 text-cyan-400">Services</h3>
              <ul className="space-y-3">
                {['Luxury Properties', 'Investment Analysis', '3D Virtual Tours', 'Market Intelligence', 'Concierge Service'].map((service) => (
                  <li key={service} className="text-white/70 hover:text-cyan-400 transition-colors cursor-pointer">
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-6 text-cyan-400">Contact</h3>
              <ul className="space-y-3">
                <li className="text-white/70">
                  <span className="font-medium">Phone:</span> +1 (555) LUXURY-1
                </li>
                <li className="text-white/70">
                  <span className="font-medium">Email:</span> hello@landestate.com
                </li>
                <li className="text-white/70">
                  <span className="font-medium">Address:</span> 
                  <br />123 Luxury Avenue
                  <br />Beverly Hills, CA 90210
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/60 text-sm">
                &copy; 2025 Landestate. All rights reserved. Luxury redefined.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                  <a key={link} href="#" className="text-white/60 hover:text-cyan-400 text-sm transition-colors">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default test;