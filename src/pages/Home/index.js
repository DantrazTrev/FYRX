import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Shield, 
  BarChart3, 
  Eye,
  Brain,
  Lock,
  Zap,
  Users,
  ChevronRight,
  Star,
  ArrowRight,
  Video
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Home = ({ Anim }) => {
  const Nav = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All video processing happens locally in your browser. Your data never leaves your device.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description: 'Advanced facial recognition and emotion detection powered by cutting-edge AI models.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Insights',
      description: 'Get instant analytics and emotional feedback while watching your videos.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with real-time processing and instant results.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const emotions = [
    { emoji: '😊', name: 'Happy', count: '2.5k+' },
    { emoji: '😢', name: 'Sad', count: '1.8k+' },
    { emoji: '😮', name: 'Surprised', count: '3.2k+' },
    { emoji: '😡', name: 'Angry', count: '950+' },
  ];

  const testimonials = [
    {
      text: "FYRX has revolutionized how I understand my audience's emotional response to content.",
      author: "Sarah Chen",
      role: "Content Creator",
      rating: 5
    },
    {
      text: "The privacy-first approach is what sold me. Finally, analytics without compromising data.",
      author: "Mark Rodriguez",
      role: "Digital Marketer",
      rating: 5
    },
    {
      text: "Incredible insights that helped improve my video content engagement by 300%!",
      author: "Emily Watson",
      role: "YouTuber",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
            >
              <Zap className="w-4 h-4 mr-2" />
              Now with Real-Time Emotion Detection
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
            >
              Understand Your{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Audience's Emotions
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
            >
              Get powerful video analytics with real-time emotion detection. 
              Track viewer engagement and sentiment without compromising privacy. 
              <span className="font-semibold text-gray-900 dark:text-white"> All processing happens locally on your device.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                variant="primary"
                size="lg"
                icon={Play}
                onClick={() => Nav('/dashboard')}
              >
                Start Analyzing
              </Button>
              <Button
                variant="ghost"
                size="lg"
                icon={Video}
                onClick={() => Nav('/watch')}
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex items-center gap-8 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">100% Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">10k+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">4.9 Rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative">
              {/* Video Player Mock */}
              <Card glass className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer"
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </motion.div>
                  </div>
                </div>
              </Card>

              {/* Floating Emotion Cards */}
              <div className="absolute -top-4 -right-4">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-white dark:bg-dark-card rounded-xl p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">😊</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Happy</p>
                      <p className="text-sm font-bold">85%</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="absolute -bottom-4 -left-4">
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="bg-white dark:bg-dark-card rounded-xl p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">😮</span>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Surprised</p>
                      <p className="text-sm font-bold">12%</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Powerful Features for{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Better Insights
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to understand your audience's emotional journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Three simple steps to unlock emotional insights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Your Video',
                description: 'Choose any video from YouTube or upload your own content',
                icon: Video
              },
              {
                step: '02',
                title: 'Enable Your Camera',
                description: 'Allow camera access for emotion detection (stays local)',
                icon: Eye
              },
              {
                step: '03',
                title: 'Get Analytics',
                description: 'View real-time emotional analytics and download reports',
                icon: BarChart3
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="inline-block mb-4">
                    <div className="relative">
                      <div className="text-6xl font-bold text-gray-100 dark:text-gray-800">
                        {item.step}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <item.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-gray-300 dark:text-gray-700" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Loved by Creators</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              See what our users are saying about FYRX
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">{testimonial.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card glass className="text-center p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">
                Ready to Understand Your Audience?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Start analyzing videos and get emotional insights today. It's free!
              </p>
              <Button
                variant="primary"
                size="xl"
                icon={ArrowRight}
                onClick={() => Nav('/dashboard')}
                className="mx-auto"
              >
                Get Started for Free
              </Button>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                No credit card required • 100% Privacy Guaranteed
              </p>
            </motion.div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;