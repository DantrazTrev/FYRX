/* eslint no-use-before-define: 0 */ // --> OFF

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera as CameraIcon, CameraOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import * as faceapi from 'face-api.js';

function Camera({ videoref, handleVideoPlay, setintilaizing }) {
  const [isActive, setIsActive] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const streamref = useRef();

  useEffect(() => {
    let stream;
    const startVideo = () => {
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }

      // Some browsers partially implement mediaDevices. We can't just assign an object
      // with getUserMedia as it would overwrite existing properties.
      // Here, we will just add the getUserMedia property if it's missing.
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // First get ahold of the legacy getUserMedia, if present
          var getUserMedia =
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

          // Some browsers just don't implement it - return a rejected promise with an error
          // to keep a consistent interface
          if (!getUserMedia) {
            return Promise.reject(
              new Error('getUserMedia is not implemented in this browser')
            );
          }

          // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }

      navigator.mediaDevices
        .getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          } 
        })
        .then(function (stream) {
          // Older browsers may not have srcObject
          streamref.current = stream;
          if ('srcObject' in videoref.current) {
            videoref.current.srcObject = stream;
          } else {
            // Avoid using this in new browsers, as it is going away.
            videoref.current.src = stream;
          }
          videoref.current.onloadedmetadata = function (e) {
            videoref.current.play();
            setIsActive(true);
            setIsLoading(false);
          };
          setintilaizing(false);
        })
        .catch(function (err) {
          console.log(err.name + ': ' + err.message);
          setHasError(true);
          setIsLoading(false);
          setintilaizing(false);
        });
    };
    
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      setintilaizing(true);
      setIsLoading(true);
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        startVideo();
      } catch (error) {
        console.error('Error loading models:', error);
        setHasError(true);
        setIsLoading(false);
        setintilaizing(false);
      }
    };
    
    loadModels();

    return () => {
      if (streamref.current) {
        streamref.current.getTracks().forEach(function (track) {
          track.stop();
        });
      }
    };
  }, [setintilaizing, videoref]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="camera-container"
    >
      <div className="camera-header">
        <div className="camera-title">
          <CameraIcon className="w-5 h-5" />
          <span>Live Camera Feed</span>
        </div>
        <div className="camera-status">
          {isLoading && (
            <div className="status-item loading">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Initializing...</span>
            </div>
          )}
          {isActive && !hasError && (
            <div className="status-item active">
              <CheckCircle className="w-4 h-4" />
              <span>Active</span>
            </div>
          )}
          {hasError && (
            <div className="status-item error">
              <AlertCircle className="w-4 h-4" />
              <span>Error</span>
            </div>
          )}
        </div>
      </div>

      <div className="camera-preview">
        {isLoading && (
          <div className="camera-loading">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p>Loading AI models...</p>
          </div>
        )}
        
        {hasError && (
          <div className="camera-error">
            <CameraOff className="w-12 h-12" />
            <p>Camera access denied or unavailable</p>
            <p className="error-detail">
              Please allow camera access to analyze emotions
            </p>
          </div>
        )}
        
        {isActive && !hasError && (
          <div className="camera-video-container">
            <video
              className="camera-video"
              ref={videoref}
              autoPlay
              muted
              playsInline
              onPlay={() => handleVideoPlay()}
            />
            <div className="camera-overlay">
              <div className="face-detection-box"></div>
            </div>
          </div>
        )}
      </div>

      <div className="camera-info">
        <p className="camera-description">
          Your camera feed is processed locally for emotion detection
        </p>
      </div>
    </motion.div>
  );
}

export default Camera;
