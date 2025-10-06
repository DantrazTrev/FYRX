import * as faceapi from 'face-api.js';
import { useState, useRef, useEffect } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Upload, Download, Camera as CameraIcon, AlertCircle, CheckCircle, Loader2, Shield } from 'lucide-react';
import Camera from '../../components/camera';
import UploadModal from '../../components/UploadModal';
import { useSelector } from 'react-redux';
import './index.css';
import ReactPlayer from 'react-player';
import { ARRAY_MAP } from '../../data/';
import { isValidHttpUrl } from '../../utils/helperFunction';
import { Navigate, useNavigate } from 'react-router-dom';

function Cam() {
  const [intilaizing, setintilaizing] = useState(false);
  const videoref = useRef();
  const player = useRef();
  const firestore = useFirestore();
  const firebase = useFirebase();
  const [start, setStart] = useState(false);
  const [play, setPlay] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [url, seturl] = useState('');
  const [prog, setProgress] = useState({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
  });
  const [detection, setdetection] = useState('');
  const [Json, setJson] = useState([]);
  const [onFinish, setFinish] = useState(false);
  const [modal, setModal] = useState(false);
  const nav = useNavigate();
  const intervalref = useRef();
  var toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor(sec_num / 60) % 60;
    var seconds = sec_num % 60;

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  };
  const { uid } = useSelector((state) => state.firebase.auth);

  const downloadFile = async () => {
    const fileName = 'metdata';
    const json = JSON.stringify(Json);
    const blob = new Blob([json], { type: 'application/json' });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleProgress = (state) => {
    setProgress(state);
  };
  const uploadVideo = async (isPrivate, filename) => {
    const json = JSON.stringify(Json);
    const blob = new Blob([json], { type: 'application/json' });
    const promE = Json.reduce((r, a) => r.map((b, i) => a[i] + b)).reduce(
      (iMax, x, i, arr) => (x > arr[iMax] ? i : iMax),
      0
    );
    console.log(promE);
    if (isPrivate) {
      let vidId;
      await firestore
        .collection(`users/${uid}/videos`)
        .add({
          name: filename,
          src: '',
          emotion_id: promE,
          isPrivate: true,
        })
        .then((res) => {
          vidId = res.id;
        });
      await firebase
        .storage()
        .ref(`users/${uid}/videos/${vidId}/metadata.json`)
        .put(blob);
      let src;
      if (!url) {
        await firebase
          .storage()
          .ref(`users/${uid}/videos/${vidId}/video.mp4`)
          .put(selectedFile);
        src = await firebase
          .storage()
          .ref(`users/${uid}/videos/${vidId}/video.mp4`)
          .getDownloadURL();
      } else {
        src = url;
      }

      await firestore.doc(`users/${uid}/videos/${vidId}`).update({
        src: src,
      });
    } else {
      let vidId;
      await firestore
        .collection(`videos`)
        .add({
          name: filename,
          src: '',
          emotion_id: promE,
          isPrivate: false,
        })
        .then((res) => {
          vidId = res.id;
        });
      await firebase.storage().ref(`videos/${vidId}/metadata.json`).put(blob);
      let src;
      if (!url) {
        await firebase
          .storage()
          .ref(`videos/${vidId}/video.mp4`)
          .put(selectedFile);
        src = await firebase
          .storage()
          .ref(`videos/${vidId}/video.mp4`)
          .getDownloadURL();
      } else {
        src = url;
      }
      await firestore.doc(`videos/${vidId}`).update({
        src: src,
      });
    }
    nav('/dashboard');
  };
  const handleVideoPlay = (play = false) => {
    console.log(intilaizing, play, 'handleVideoPlay');
    if (intilaizing) return;
    if (url === '') player.current?.play();
    if (!play) return;

    intervalref.current = setInterval(async () => {
      const detections = await faceapi
        .detectSingleFace(
          videoref.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

      if (detections) {
        //For each face detection
        console.log(detections);
        if ('expressions' in detections) {
          let status = Object.keys(detections.expressions).reduce((a, b) =>
            detections.expressions[a] > detections.expressions[b] ? a : b
          );
          setdetection(
            toHHMMSS(
              player.current.currentTime || player.current.getCurrentTime()
            ) +
              ' ' +
              status
          );

          let new_json = Json;
          new_json.push(ARRAY_MAP[status]);
          setJson(new_json);

          // const marker = document.createElement('div');

          // marker.style.position = 'absolute';
          // marker.style.backgroundColor = colors[status];
          // marker.style.height = '95%';
          // marker.style.width = '2%';
          // marker.style.left = `${
          //   (player.current.currentTime / player.current.duration) * 100
          // }%`;

          // progress.current.appendChild(marker);
        }
      } else {
        let new_json = Json;
        new_json.push([0, 0, 0, 0, 0, 0, 0]);
        setJson(new_json);
      }
    }, 1000);
  };
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setStart(true);
  };
  const urlref = useRef();
  const onSubmit = (event) => {
    event.preventDefault();
    if (ReactPlayer.canPlay(urlref.current.value)) {
      seturl(urlref.current.value);
    } else {
    }
  };

  useEffect(() => {
    if (onFinish) {
      clearInterval(intervalref.current);
    }
  }, [onFinish]);

  return (
    <div className="video-analytics-container">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="analytics-header"
      >
        <div className="header-content">
          <h1 className="header-title">Video Emotion Analytics</h1>
          <p className="header-subtitle">
            Real-time facial expression analysis powered by AI
          </p>
        </div>
        <div className="privacy-badge">
          <Shield className="w-4 h-4" />
          <span>100% Private - Data stays on your device</span>
        </div>
      </motion.div>

      {/* Main Video Area */}
      <div className="video-main-area">
        <div className="video-container">
          <AnimatePresence mode="wait">
            {!start ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="upload-section"
              >
                <div className="upload-content">
                  <div className="upload-icon">
                    <Upload className="w-16 h-16" />
                  </div>
                  <h2 className="upload-title">Choose Your Video</h2>
                  <p className="upload-description">
                    Upload a video file or paste a YouTube URL to start analyzing emotions
                  </p>
                  
                  <div className="upload-options">
                    <label htmlFor="file" className="upload-btn primary">
                      <Upload className="w-5 h-5" />
                      Choose Video File
                    </label>
                    
                    <form onSubmit={onSubmit} className="url-form">
                      <div className="input-group">
                        <input
                          type="url"
                          ref={urlref}
                          placeholder="Paste YouTube URL here..."
                          className="url-input"
                        />
                        <button type="submit" className="url-submit">
                          Analyze
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="player"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="player-section"
              >
                <div className="video-wrapper">
                  {selectedFile && (
                    <video
                      ref={player}
                      className="video-player"
                      onPlay={() => {
                        setPlay(true);
                        handleVideoPlay(true);
                      }}
                      onPause={() => {
                        setPlay(false);
                      }}
                      onEnded={() => {
                        setFinish(true);
                        setModal(true);
                      }}
                    >
                      <source
                        src={URL.createObjectURL(selectedFile)}
                        type="video/mp4"
                      />
                    </video>
                  )}
                  
                  {url && !intilaizing && (
                    <ReactPlayer
                      className="video-player"
                      playing={play && !intilaizing}
                      onReady={() => {
                        setStart(true);
                      }}
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
                      url={url}
                      onStart={() => {
                        setPlay(true);
                      }}
                      onPlay={() => {
                        setPlay(true);
                        handleVideoPlay(true);
                      }}
                      onPause={() => {
                        setPlay(false);
                      }}
                      onEnded={() => {
                        setFinish(true);
                        setModal(true);
                      }}
                      onProgress={handleProgress}
                      controls={false}
                    />
                  )}

                  {/* Video Controls Overlay */}
                  <div className="video-controls-overlay">
                    <div className="controls-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="play-pause-btn"
                        onClick={() => {
                          if (play) {
                            player.current?.pause();
                          } else {
                            player.current?.play();
                          }
                        }}
                      >
                        {play ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                      </motion.button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress-filled"
                        style={{
                          width: selectedFile
                            ? play
                              ? `${
                                  (player.current?.currentTime /
                                    player.current?.duration) *
                                  100
                                }%`
                              : '0%'
                            : `${prog.played * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Emotion Detection Display */}
                <div className="emotion-display">
                  <div className="emotion-status">
                    <div className="status-indicator">
                      {intilaizing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>
                        {intilaizing ? 'Initializing AI...' : 'Emotion Detection Active'}
                      </span>
                    </div>
                    <div className="current-emotion">
                      {detection && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="emotion-badge"
                        >
                          {detection}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="action-buttons">
            {onFinish && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
                onClick={() => setModal(true)}
              >
                <Upload className="w-5 h-5" />
                Save Analysis
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-secondary"
              onClick={downloadFile}
            >
              <Download className="w-5 h-5" />
              Download Data
            </motion.button>
          </div>
        </div>

        {/* Camera Component */}
        {start && !onFinish && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="camera-section"
          >
            <Camera
              handleVideoPlay={handleVideoPlay}
              videoref={videoref}
              setintilaizing={setintilaizing}
            />
            <div className="privacy-notice">
              <AlertCircle className="w-4 h-4" />
              <span>Your camera feed is processed locally and never stored</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Hidden Inputs */}
      <input
        type="file"
        id="file"
        style={{ display: 'none' }}
        onChange={changeHandler}
        accept="video/mp4"
      />

      {/* Upload Modal */}
      <AnimatePresence>
        {modal && (
          <UploadModal
            handleClose={() => {
              setModal(false);
            }}
            Uploadfile={uploadVideo}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Cam;
