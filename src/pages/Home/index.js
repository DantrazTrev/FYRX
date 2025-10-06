import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, BarChart3, Shield, Zap, ArrowRight, Star } from 'lucide-react';
import './index.css';

const Home = ({ Anim }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy First",
      description: "All analysis happens locally in your browser. Your video data never leaves your device."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Get instant emotion analysis and detailed insights as you watch your videos."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Powered by advanced AI models that work seamlessly in your browser."
    }
  ];

  const stats = [
    { number: "10K+", label: "Videos Analyzed" },
    { number: "99.9%", label: "Privacy Guaranteed" },
    { number: "7", label: "Emotions Detected" },
    { number: "0ms", label: "Data Transfer" }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="hero-text"
            >
              <div className="badge">
                <Star className="w-4 h-4" />
                <span>100% Privacy-First Video Analytics</span>
              </div>
              
              <h1 className="hero-title">
                Understand Your Audience's
                <span className="text-gradient"> Emotions</span>
                <br />
                in Real-Time
              </h1>
              
              <p className="hero-description">
                Analyze video engagement through facial expression recognition. 
                Get detailed emotion analytics without compromising privacy - 
                everything happens locally in your browser.
              </p>

              <div className="hero-actions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('dashboard')}
                >
                  <Play className="w-5 h-5" />
                  Start Analyzing
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-secondary btn-lg"
                  onClick={() => navigate('tutorials')}
                >
                  View Tutorial
                </motion.button>
              </div>

              <div className="hero-stats">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="stat-item"
                  >
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-visual"
            >
              <div className="video-preview">
                <div className="video-placeholder">
                  <Play className="w-16 h-16 text-white" />
                </div>
                <div className="emotion-indicators">
                  <div className="emotion-dot happy" data-emotion="happy">😊</div>
                  <div className="emotion-dot surprised" data-emotion="surprised">😲</div>
                  <div className="emotion-dot neutral" data-emotion="neutral">😐</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">Why Choose FYRX?</h2>
            <p className="section-description">
              Advanced video analytics that respect your privacy and deliver powerful insights.
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="feature-card"
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">
              Join thousands of creators who trust FYRX for their video analytics needs.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary btn-lg"
              onClick={() => navigate('dashboard')}
            >
              <Play className="w-5 h-5" />
              Start Your First Analysis
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
