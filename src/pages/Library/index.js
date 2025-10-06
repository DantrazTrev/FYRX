import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  VideoCameraIcon,
  ChartBarIcon,
  FolderIcon,
  UserIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowLeftIcon,
  EmojiHappyIcon,
  EmojiSadIcon,
  FaceSmileIcon,
  FaceFrownIcon
} from '@heroicons/react/24/outline';
import LoginModal from '../../components/LoginModal';
import Cards from '../../components/Cards';

function Library() {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const { uid, email } = useSelector((state) => state.firebase.auth);

  const [loginModal, setModal] = useState(false);
  const [currTab, setTab] = useState('ex');
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarItems = [
    { id: 'ex', label: 'Explore', icon: HomeIcon },
    { id: 'my', label: 'My Videos', icon: VideoCameraIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'emotions', label: 'Emotions', icon: FaceSmileIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src={require('../../assets/logo.png')}
                  alt="FYRX Logo"
                  className="h-8 w-auto"
                />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Dashboard
                </h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/watch')}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span>New Analysis</span>
              </button>
              
              <button
                onClick={() => {
                  if (uid) firebase.logout();
                  else setModal(!loginModal);
                }}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <UserIcon className="h-5 w-5" />
                <span className="font-medium">
                  {uid ? 'Sign Out' : 'Sign In'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Categories
              </h2>
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                      currTab === item.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total Videos</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Hours Analyzed</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">8.5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Emotions Detected</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">1,247</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              {/* Content Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currTab === 'ex' && 'Explore Videos'}
                    {currTab === 'my' && 'My Videos'}
                    {currTab === 'analytics' && 'Analytics Overview'}
                    {currTab === 'emotions' && 'Emotion Categories'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {currTab === 'ex' && 'Discover public video analyses from the community'}
                    {currTab === 'my' && 'Your personal video collection and analyses'}
                    {currTab === 'analytics' && 'Comprehensive insights from your video analyses'}
                    {currTab === 'emotions' && 'Browse videos by detected emotions'}
                  </p>
                </div>
                
                {currTab !== 'analytics' && (
                  <div className="flex items-center space-x-2">
                    <select className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Most Recent</option>
                      <option>Most Popular</option>
                      <option>Highest Engagement</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="min-h-[400px]">
                <Cards currTab={currTab} searchQuery={searchQuery} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {loginModal && (
        <LoginModal
          handleClose={() => {
            setModal(false);
          }}
        />
      )}
    </div>
  );
}

export default Library;
