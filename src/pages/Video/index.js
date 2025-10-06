import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import queryString, { stringify } from 'query-string';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import Charts from '../../components/Charts';
import Timeline from '../../components/Timeline';
import LoadingSpinner from '../../components/LoadingSpinner';
import axios from 'axios';
import {
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  ChartBarIcon,
  EyeIcon,
  PlusIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
function Video() {
  const location = useLocation();
  const navigate = useNavigate();
  const firestore = useFirestore();
  const firebase = useFirebase();
  const player = useRef();
  const [add, setAdd] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [progress, setProgress] = useState({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
  });
  const [vidId, setVidId] = useState(
    queryString.parse(location.search, {
      parseNumbers: true,
      parseBooleans: true,
    }).id
  );
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [vdata, setVdata] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    firestore
      .doc(`videos/${vidId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setVdata(doc.data());
        } else {
        }
      });
    firebase
      .storage()
      .ref(`videos/${vidId}/metadata.json`)
      .getDownloadURL()
      .then(
        (url) => {
          axios(url).then((res) => {
            setTimeline(res.data);
            setTimeout(() => {
              setLoading(false);
            }, 500);
          });
        },
        () => {
          setTimeline([]);
          setTimeout(() => {
            setLoading(false);
          }, 500);
        }
      );
  }, [vidId]);

  useEffect(() => {
    setPlaying(false);
  }, [ready]);
  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    setProgress(state);
  };
  if (add === true) {
    return <Navigate replace to={`/app?id=${vidId}`} />;
  }
  if (loading === true) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
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
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {vdata.name || 'Video Analysis'}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Emotion analysis results
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ShareIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="aspect-video bg-gray-900 relative">
                <ReactPlayer
                  className="w-full h-full"
                  width="100%"
                  height="100%"
                  config={{
                    youtube: {
                      playerVars: {
                        autoplay: 0,
                        iv_load_policy: 3,
                        modestbranding: 1,
                        playsinline: 1,
                        rel: 0,
                        showinfo: 0,
                        disablekb: 0,
                      },
                    },
                  }}
                  light={false}
                  ref={player}
                  url={vdata.src}
                  controls={false}
                  playing={playing}
                  onReady={() => {
                    setReady(true);
                  }}
                  onProgress={handleProgress}
                />
                
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                  <div
                    className="h-full bg-blue-500 transition-all duration-100"
                    style={{
                      width: `${progress.played * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Video Controls */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handlePlayPause}
                      className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                    >
                      {playing ? (
                        <PauseIcon className="h-6 w-6" />
                      ) : (
                        <PlayIcon className="h-6 w-6" />
                      )}
                    </button>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span>{Math.round(progress.playedSeconds)}s / {Math.round(progress.loadedSeconds)}s</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setAdd(true)}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Sample</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline Visualization */}
            {timeline.length !== 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <ChartBarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Emotion Timeline
                  </h3>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <Timeline data={timeline} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  This timeline shows the detected emotions throughout the video duration
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Analytics */}
          <div className="lg:col-span-1 space-y-6">
            {/* Emotion Distribution Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <EyeIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Emotion Distribution
                </h3>
              </div>
              
              {timeline.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <ChartBarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No analysis data available</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Charts data={timeline} />
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Video Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Duration</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {Math.round(progress.loadedSeconds)}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Data Points</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {timeline.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Analysis Type</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Facial Emotion
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Emotion Legend
              </h3>
              <div className="space-y-2">
                {[
                  { emotion: 'Happy', color: '#ffc409', emoji: '😊' },
                  { emotion: 'Sad', color: '#f14702', emoji: '😢' },
                  { emotion: 'Angry', color: '#262d97', emoji: '😠' },
                  { emotion: 'Surprised', color: 'pink', emoji: '😲' },
                  { emotion: 'Fearful', color: '#036ecd', emoji: '😨' },
                  { emotion: 'Disgusted', color: '#9ecadd', emoji: '🤢' },
                  { emotion: 'Neutral', color: '#51666e', emoji: '😐' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {item.emotion}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;
