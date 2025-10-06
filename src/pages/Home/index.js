import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlayCircleIcon, 
  ChartBarIcon, 
  EyeIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Home = ({ Anim }) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const features = [
    {
      icon: EyeIcon,
      title: "Real-time Emotion Detection",
      description: "Advanced AI analyzes facial expressions in real-time while you watch videos"
    },
    {
      icon: ChartBarIcon,
      title: "Detailed Analytics",
      description: "Get comprehensive insights with beautiful charts and timeline visualizations"
    },
    {
      icon: ShieldCheckIcon,
      title: "Privacy First",
      description: "All processing happens locally in your browser - your data never leaves your device"
    },
    {
      icon: SparklesIcon,
      title: "Free & Open Source",
      description: "Completely free to use with no hidden costs or data collection"
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Background with animated orbs */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <canvas className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:p-8">
        <div className="flex items-center space-x-3">
          <img
            src={require('../../assets/logo.png')}
            alt="FYRX Logo"
            className="h-12 w-auto"
          />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">FYRX</span>
        </div>
        
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Unlock the{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  emotions
                </span>{' '}
                in your videos
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Experience the future of video analytics with real-time emotion detection. 
                Get deep insights into viewer engagement while keeping your data completely private.
              </p>
            </div>

            {/* Privacy Badge */}
            <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium">
              <ShieldCheckIcon className="h-4 w-4" />
              <span>100% Private - Data never leaves your device</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('dashboard')}
                className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <PlayCircleIcon className="h-6 w-6" />
                <span>Start Analyzing</span>
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate('watch')}
                className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-200"
              >
                <EyeIcon className="h-6 w-6" />
                <span>Try Demo</span>
              </button>
            </div>
          </div>

          {/* Right Column - 3D Illustration */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={require('../../assets/3D.png')}
                alt="3D Illustration"
                className="w-full h-auto animate-float drop-shadow-2xl"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Why Choose FYRX?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced emotion detection technology meets privacy-first design
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to unlock video insights?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start analyzing emotions in your videos today. No signup required, completely free.
          </p>
          <button
            onClick={() => navigate('dashboard')}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
