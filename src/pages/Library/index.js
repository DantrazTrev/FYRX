import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, User, LogOut, LogIn, Plus, Filter, Search, Grid, List } from 'lucide-react';
import './index.css';
import Sidebar from '../../components/Sidebar';
import LoginModal from '../../components/LoginModal';
import Cards from '../../components/Cards';
import { useSelector, useDispatch } from 'react-redux';
import { useFirebase, useFirestore } from 'react-redux-firebase';

function Library() {
  const firebase = useFirebase();
  const { uid, email } = useSelector((state) => state.firebase.auth);
  const [loginModal, setModal] = useState(false);
  const [currTab, setTab] = useState('ex');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="library-container">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="library-header"
      >
        <div className="header-content">
          <div className="header-left">
            <div className="logo-section">
              <BarChart3 className="w-8 h-8 text-primary-600" />
              <h1 className="header-title">Analytics Dashboard</h1>
            </div>
            <p className="header-subtitle">
              View and analyze your video emotion data
            </p>
          </div>
          
          <div className="header-actions">
            <div className="search-container">
              <Search className="w-4 h-4 search-icon" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button className="btn btn-primary">
              <Plus className="w-4 h-4" />
              New Analysis
            </button>
            
            <button
              className="btn btn-secondary"
              onClick={() => {
                if (uid) firebase.logout();
                else setModal(!loginModal);
              }}
            >
              {uid ? (
                <>
                  <LogOut className="w-4 h-4" />
                  Log Out
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Log In
                </>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="library-main">
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="library-sidebar"
        >
          <Sidebar currTab={currTab} setTab={setTab} />
        </motion.aside>
        
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="library-content"
        >
          <div className="content-header">
            <div className="content-title">
              <h2>Your Video Analytics</h2>
              <p>Track emotions and engagement across your videos</p>
            </div>
            
            <div className="content-filters">
              <button className="filter-btn">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
          
          <div className={`cards-container ${viewMode}`}>
            <Cards currTab={currTab} />
          </div>
        </motion.main>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModal}
        handleClose={() => setModal(false)}
      />
    </div>
  );
}

export default Library;
