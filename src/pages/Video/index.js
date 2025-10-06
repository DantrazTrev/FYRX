import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import queryString from 'query-string';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Share2, 
  Download,
  Info,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

import VideoPlayer from '../../components/VideoPlayer';
import EmotionAnalytics from '../../components/EmotionAnalytics';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

function Video() {
  const location = useLocation();
  const firestore = useFirestore();
  const firebase = useFirebase();
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
  const [vdata, setVdata] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideoData = async () => {
      try {
        // Load video metadata
        const doc = await firestore.doc(`videos/${vidId}`).get();
        if (doc.exists) {
          setVdata(doc.data());
        }

        // Load analytics data
        try {
          const url = await firebase
            .storage()
            .ref(`videos/${vidId}/metadata.json`)
            .getDownloadURL();
          
          const res = await axios(url);
          setTimeline(res.data);
        } catch (error) {
          // No analytics data yet
          setTimeline([]);
        }
      } catch (error) {
        toast.error('Failed to load video data');
      } finally {
        setLoading(false);
      }
    };

    if (vidId) {
      loadVideoData();
    }
  }, [vidId, firestore, firebase]);

  const handleProgress = (state) => {
    setProgress(state);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const handleDownloadAnalytics = () => {
    if (timeline.length === 0) {
      toast.error('No analytics data available');
      return;
    }

    const dataStr = JSON.stringify(timeline, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analytics_${vidId}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Analytics downloaded successfully');
  };

  if (add === true) {
    return <Navigate replace to={`/app?id=${vidId}`} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full border-4 border-gray-300 border-t-blue-600 rounded-full"
            />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {vdata.name || 'Untitled Video'}
              </h1>
              {vdata.description && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {vdata.description}
                </p>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                icon={Share2}
                onClick={handleShare}
              >
                Share
              </Button>
              {timeline.length > 0 && (
                <Button
                  variant="secondary"
                  icon={Download}
                  onClick={handleDownloadAnalytics}
                >
                  Export
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card padding={false} className="overflow-hidden">
              <VideoPlayer
                url={vdata.src}
                playing={playing}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onProgress={handleProgress}
                className="aspect-video"
              />
            </Card>

            {/* Video Info */}
            <Card>
              <div className="flex items-start gap-4">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">About this video</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This video has been analyzed for emotional responses using advanced AI. 
                    All processing happens locally in your browser for complete privacy.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-500">Duration:</span>
                      <span className="ml-2 font-medium">
                        {Math.floor(progress.loadedSeconds / 60)}:{String(Math.floor(progress.loadedSeconds % 60)).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-500">Analytics:</span>
                      <span className="ml-2 font-medium">
                        {timeline.length > 0 ? 'Available' : 'Not available'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Add Sample CTA */}
            {timeline.length === 0 && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      No analytics data yet
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Watch this video with emotion detection enabled to generate analytics
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    icon={Plus}
                    onClick={() => setAdd(true)}
                  >
                    Add Analytics
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Analytics Section */}
          <div className="lg:col-span-1">
            {timeline.length > 0 ? (
              <div className="sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Emotion Analytics</h2>
                <EmotionAnalytics 
                  data={timeline} 
                  currentTime={progress.playedSeconds}
                />
                
                {/* Add More Samples */}
                <Card className="mt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Want to improve accuracy?
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Plus}
                      onClick={() => setAdd(true)}
                      className="w-full"
                    >
                      Add Another Sample
                    </Button>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-dark-hover flex items-center justify-center">
                  <BarChart3 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Analytics Yet</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Enable emotion detection to see detailed analytics for this video
                </p>
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={() => setAdd(true)}
                >
                  Generate Analytics
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;