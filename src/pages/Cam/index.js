import * as faceapi from 'face-api.js';
import { useState, useRef, useEffect } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import Camera from '../../components/camera';
import UploadModal from '../../components/UploadModal';
import { useSelector } from 'react-redux';
import ReactPlayer from 'react-player';
import { ARRAY_MAP } from '../../data/';
import { isValidHttpUrl } from '../../utils/helperFunction';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  VideoCameraIcon,
  LinkIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => nav('/dashboard')}
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
                  Video Analysis
                </h1>
              </div>
            </div>
            
            {/* Privacy Badge */}
            <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
              <ShieldCheckIcon className="h-4 w-4" />
              <span>Private & Secure</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Video Container */}
              <div className="aspect-video bg-gray-900 relative">
                {selectedFile && (
                  <>
                    <video
                      ref={player}
                      className="w-full h-full object-cover"
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
                        id='video'
                        type='video/mp4'
                      />
                    </video>
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                      <div
                        className="h-full bg-blue-500 transition-all duration-100"
                        style={
                          play
                            ? {
                                width: `${
                                  (player.current?.currentTime /
                                    player.current?.duration) *
                                  100
                                }%`,
                              }
                            : {}
                        }
                      ></div>
                    </div>
                  </>
                )}
                
                {url && !intilaizing && (
                  <>
                    <ReactPlayer
                      className="w-full h-full"
                      playing={play && !intilaizing}
                      width="100%"
                      height="100%"
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
                    {start && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                        <div
                          className="h-full bg-blue-500 transition-all duration-100"
                          style={{
                            width: `${prog.played * 100}%`,
                          }}
                        ></div>
                      </div>
                    )}
                  </>
                )}

                {/* Upload Interface */}
                {!start && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-6 p-8">
                      <div className="w-24 h-24 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <VideoCameraIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white">
                          Upload Your Video
                        </h3>
                        <p className="text-gray-300">
                          Choose a video file or paste a URL to start analyzing emotions
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <label
                          htmlFor="file"
                          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors"
                        >
                          <CloudArrowUpIcon className="h-5 w-5" />
                          <span>Choose Video File</span>
                        </label>
                        
                        <div className="text-gray-400">or</div>
                        
                        <form onSubmit={onSubmit} className="w-full max-w-md">
                          <div className="flex space-x-2">
                            <input
                              type="url"
                              ref={urlref}
                              placeholder="Paste video URL here..."
                              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="submit"
                              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                              <LinkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Controls & Info */}
              {start && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setPlay(!play)}
                        className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                      >
                        {play ? (
                          <PauseIcon className="h-6 w-6" />
                        ) : (
                          <PlayIcon className="h-6 w-6" />
                        )}
                      </button>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {detection && (
                          <div className="flex items-center space-x-2">
                            <EyeIcon className="h-4 w-4" />
                            <span>Current: {detection}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {onFinish && (
                      <button
                        onClick={() => setModal(true)}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <CloudArrowUpIcon className="h-4 w-4" />
                        <span>Save Analysis</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Camera Feed */}
            {start && !onFinish && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Camera Feed
                </h3>
                <Camera
                  handleVideoPlay={handleVideoPlay}
                  videoref={videoref}
                  setintilaizing={setintilaizing}
                />
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <ShieldCheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Your camera feed is processed locally. No video data is sent to our servers.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                How it works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    1
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Upload a video or paste a URL
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    2
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Allow camera access for emotion detection
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    3
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Watch the video while AI analyzes your emotions
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                    4
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Get detailed analytics and insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        id="file"
        className="hidden"
        onChange={changeHandler}
        accept="video/mp4"
      />

      {/* Upload Modal */}
      {modal && (
        <UploadModal
          handleClose={() => {
            setModal(false);
          }}
          Uploadfile={uploadVideo}
        />
      )}
    </div>
  );
}

export default Cam;
