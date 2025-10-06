import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Upload,
  Video,
  BarChart,
  Clock,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Folder,
  ChevronDown
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import LoginModal from '../../components/LoginModal';
import Cards from '../../components/Cards';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

function Library() {
  const firebase = useFirebase();
  const { uid, email } = useSelector((state) => state.firebase.auth);
  const [loginModal, setModal] = useState(false);
  const [currTab, setTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const tabs = [
    { id: 'all', label: 'All Videos', icon: Video, count: 24 },
    { id: 'recent', label: 'Recent', icon: Clock, count: 8 },
    { id: 'favorites', label: 'Favorites', icon: Heart, count: 5 },
    { id: 'analytics', label: 'With Analytics', icon: BarChart, count: 12 },
  ];

  const stats = [
    { label: 'Total Videos', value: '24', icon: Video, trend: '+12%', color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Views', value: '1.2k', icon: Eye, trend: '+8%', color: 'from-purple-500 to-pink-500' },
    { label: 'Avg. Engagement', value: '68%', icon: TrendingUp, trend: '+15%', color: 'from-green-500 to-emerald-500' },
    { label: 'Comments', value: '342', icon: MessageCircle, trend: '+23%', color: 'from-orange-500 to-red-500' },
  ];

  const filters = [
    { label: 'Date Range', options: ['Last 7 days', 'Last 30 days', 'Last 3 months', 'All time'] },
    { label: 'Emotion', options: ['Happy', 'Sad', 'Surprised', 'Angry', 'Neutral'] },
    { label: 'Duration', options: ['< 5 min', '5-15 min', '15-30 min', '> 30 min'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Video Library
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Manage and analyze your video content
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-3">
                {!uid && (
                  <Button
                    variant="secondary"
                    icon={Upload}
                    onClick={() => setModal(true)}
                  >
                    Sign In to Upload
                  </Button>
                )}
                {uid && (
                  <Button
                    variant="primary"
                    icon={Plus}
                    onClick={() => {/* Handle upload */}}
                  >
                    Upload Video
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      {stat.trend} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -mr-16 -mt-16`} />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters and Search Bar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border 
                           bg-white dark:bg-dark-card text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Filter Button */}
            <Button
              variant="secondary"
              icon={Filter}
              onClick={() => setFilterOpen(!filterOpen)}
              className="relative"
            >
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* View Mode Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-dark-hover rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Dropdown */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 overflow-hidden"
              >
                <Card>
                  <div className="grid md:grid-cols-3 gap-6">
                    {filters.map((filter) => (
                      <div key={filter.label}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {filter.label}
                        </label>
                        <select className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-dark-border 
                                        bg-white dark:bg-dark-card text-gray-900 dark:text-white
                                        focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>All</option>
                          {filter.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <Button variant="ghost" size="sm">
                      Clear Filters
                    </Button>
                    <Button variant="primary" size="sm">
                      Apply Filters
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-dark-border">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTab(tab.id)}
                  className={`group flex items-center gap-2 pb-4 px-1 border-b-2 font-medium text-sm transition-all ${
                    currTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    currTab === tab.id
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-dark-hover dark:text-gray-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div>
          {uid ? (
            <Cards currTab={currTab} viewMode={viewMode} searchQuery={searchQuery} />
          ) : (
            <Card className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-dark-hover flex items-center justify-center">
                  <Folder className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sign in to view your library</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create an account or sign in to start uploading and analyzing videos
                </p>
                <Button
                  variant="primary"
                  onClick={() => setModal(true)}
                >
                  Sign In / Sign Up
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {loginModal && (
        <LoginModal
          handleClose={() => setModal(false)}
        />
      )}
    </div>
  );
}

export default Library;