import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Trophy, Smartphone, MessageCircle, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Learning Modules',
      description: 'Master dental procedures with 3D simulations and step-by-step guidance',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Collaborative Study Groups',
      description: 'Join peers in real-time sessions to discuss cases and share knowledge',
      color: 'bg-green-500'
    },
    {
      icon: Trophy,
      title: 'Gamified Progress Tracking',
      description: 'Earn XP, badges, and climb the leaderboard as you advance your skills',
      color: 'bg-purple-500'
    },
    {
      icon: Smartphone,
      title: 'AR/VR Learning Experiences',
      description: 'Practice procedures in immersive virtual environments',
      color: 'bg-orange-500'
    },
    {
      icon: MessageCircle,
      title: 'AI-Powered Dental Mentor',
      description: 'Get instant answers and guidance from our specialized dental AI',
      color: 'bg-red-500'
    },
    {
      icon: Calendar,
      title: 'Live Events & Webinars',
      description: 'Participate in expert-led sessions on cutting-edge dental topics',
      color: 'bg-teal-500'
    }
  ];

  const testimonials = [
    {
      quote: "DentalMentor has revolutionized how I study dental procedures. The 3D simulations make complex techniques much easier to understand.",
      author: "Dr. Sarah Chen",
      role: "Dental Student, Year 3",
      image: "https://images.pexels.com/photos/5214961/pexels-photo-5214961.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      quote: "The AI mentor provides instant feedback on my preparation techniques. It's like having a professor available 24/7.",
      author: "Dr. Michael Rodriguez",
      role: "Prosthodontics Resident",
      image: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      quote: "Study groups have connected me with peers around the world. We share cases and learn from each other's experiences.",
      author: "Dr. Emily Zhang",
      role: "General Dentist",
      image: "https://images.pexels.com/photos/5214987/pexels-photo-5214987.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ];

  const specialties = [
    { name: 'Endodontics', icon: '🦷', color: 'bg-blue-100 text-blue-700' },
    { name: 'Periodontics', icon: '🫧', color: 'bg-green-100 text-green-700' },
    { name: 'Prosthodontics', icon: '👑', color: 'bg-purple-100 text-purple-700' },
    { name: 'Orthodontics', icon: '🦴', color: 'bg-orange-100 text-orange-700' },
    { name: 'Oral Surgery', icon: '🔪', color: 'bg-red-100 text-red-700' },
    { name: 'Pedodontics', icon: '🧸', color: 'bg-pink-100 text-pink-700' },
    { name: 'Oral Medicine', icon: '🔬', color: 'bg-indigo-100 text-indigo-700' },
    { name: 'Radiology', icon: '📸', color: 'bg-yellow-100 text-yellow-700' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Dental Education</span> is Here
                </h1>
                <p className="mt-6 text-xl text-gray-600 max-w-2xl">
                  DentalMentor combines AI-powered learning, 3D simulations, and collaborative tools to revolutionize how dental professionals master their craft.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </button>
                  <button 
                    onClick={() => {
                      const demoSection = document.getElementById('features');
                      demoSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-4 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-lg"
                  >
                    Explore Features
                  </button>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/3845757/pexels-photo-3845757.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                  alt="Dental education" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                  <div className="p-6">
                    <p className="text-white font-medium">Interactive 3D dental simulations</p>
                    <p className="text-blue-200 text-sm">Practice procedures in a risk-free environment</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 max-w-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Gamified Learning</p>
                    <p className="text-sm text-gray-500">Earn XP and badges as you progress</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Powerful Features for Dental Excellence</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with proven educational methods to enhance your dental learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Comprehensive Dental Specialties</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Explore learning modules across all major dental specialties
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {specialties.map((specialty, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="text-4xl mb-3">{specialty.icon}</div>
                <h3 className={`font-semibold ${specialty.color}`}>{specialty.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of dental professionals who have transformed their learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author} 
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.author}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Dental Education?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Join DentalMentor today and experience the future of interactive dental learning.
              </p>
              <button 
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium text-lg shadow-lg flex items-center"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-300" />
                      <span className="font-medium">5,000+ Active Users</span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-yellow-300" />
                      <span className="font-medium">200+ Learning Modules</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-yellow-300" />
                      <span className="font-medium">50+ Study Groups</span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-5 h-5 text-yellow-300" />
                      <span className="font-medium">AR/VR Experiences</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">DM</span>
                </div>
                <span className="text-xl font-bold">DentalMentor</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing dental education through interactive learning and AI technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Interactive Modules</li>
                <li>3D Simulations</li>
                <li>AI Mentor</li>
                <li>Study Groups</li>
                <li>AR/VR Learning</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Blog</li>
                <li>Documentation</li>
                <li>Tutorials</li>
                <li>Case Studies</li>
                <li>Research Papers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} DentalMentor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;