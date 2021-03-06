import * as faceapi from 'face-api.js';
import { useState, useRef, useEffect } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import Camera from '../../components/camera';
import { useSelector } from 'react-redux';
import '../Cam/index.css';
import queryString, { stringify } from 'query-string';
import { ARRAY_MAP } from '../../data/';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import ReactPlayer from 'react-player';
import Timeline from '../../components/Timeline';
function CamMode() {
  const [intilaizing, setintilaizing] = useState(false);
  const navigator = useNavigate();
  const videoref = useRef();
  const player = useRef();
  const progress = useRef();
  const location = useLocation();
  const firestore = useFirestore();
  const firebase = useFirebase();
  const [start, setStart] = useState(false);
  const [play, setPlay] = useState(false);
  const [url, seturl] = useState();
  const [detection, setdetection] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [Json, setJson] = useState([]);
  const [onFinish, setFinish] = useState(false);
  const [vidId, setVidId] = useState(
    queryString.parse(location.search, {
      parseNumbers: true,
      parseBooleans: true,
    }).id
  );
  const [prog, setProgress] = useState({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
  });
  const [vuid, setvuid] = useState(
    queryString.parse(location.search, {
      parseNumbers: true,
      parseBooleans: true,
    }).videoid
  );
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
  const handleProgress = (state) => {
    setProgress(state);
  };
  useEffect(() => {
    if (vidId) {
      firestore
        .doc(`videos/${vidId}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            seturl(doc.data().src);
          } else {
          }
        });
      firebase
        .storage()
        .ref(`videos/${vidId}/metadata.json`)
        .getDownloadURL()
        .then((url) => {
          axios(url).then((res) => {
            setTimeline(res.data);
            setTimeout(() => {
              setStart(true);
            }, 500);
          });
        });
    } else if (vuid && uid) {
      firestore
        .doc(`users/${uid}/videos/${vuid}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            seturl(doc.data().src);
          } else {
          }
        });
      firebase
        .storage()
        .ref(`users/${uid}/videos/${vuid}/metadata.json`)
        .getDownloadURL()
        .then((url) => {
          axios(url).then((res) => {
            setTimeline(res.data);
            setTimeout(() => {
              setStart(true);
            }, 500);
          });
        });
    }
  }, [vidId, vuid]);

  const uploadVideo = async () => {
    const time_copy = timeline;
    time_copy.map((ti, idx) => {
      if (idx < Json.length) {
        time_copy[idx].map((t, i) => {
          time_copy[idx][i] += Json[idx][i];
        });
      }
    });
    console.log(time_copy);
    setTimeline(time_copy);
    const blob = new Blob([JSON.stringify(time_copy)], {
      type: 'application/json',
    });
    if (vidId) {
      await firebase.storage().ref(`videos/${vidId}/metadata.json`).put(blob);
      navigator(`/video?id=${vidId}`);
    } else if (vuid && uid) {
      await firebase
        .storage()
        .ref(`users/${uid}/videos/${vuid}/metadata.json`)
        .put(blob);
      navigator(`/v?id=${vuid}`);
    }
  };

  const handleVideoPlay = (play = false) => {
    console.log(intilaizing, play, 'handleVideoPlay');
    if (intilaizing) return;
    setPlay(true);
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
  useEffect(() => {
    if (onFinish) {
      clearInterval(intervalref.current);
    }
  }, [onFinish]);

  return (
    <>
      <div className='overlay-cam'>
        <div id='preview'>
          <div id='thumb-cont'>
            {url && (
              <>
                <ReactPlayer
                  className='react-player'
                  height={501}
                  ref={player}
                  playing={play}
                  width={906}
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
                  style={{ borderRadius: '20px', objectFit: 'cover' }}
                  light={false}
                  url={url}
                  onPlay={() => {
                    setPlay(true);
                    handleVideoPlay(true);
                  }}
                  onPause={() => {
                    setPlay(false);
                  }}
                  onEnded={() => {
                    setPlay(false);
                    setFinish(true);
                  }}
                  onProgress={handleProgress}
                  controls={false}
                />

                {!onFinish && (
                  <div class='progress' ref={progress}>
                    <div
                      class='progress-filled'
                      style={{
                        width: `${prog.played * 100}%`,
                      }}
                    ></div>
                  </div>
                )}
              </>
            )}
          </div>
          {!start ? (
            <div
              style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            ></div>
          ) : (
            !onFinish && <div className='text'>{detection}</div>
          )}
          {onFinish && (
            <>
              <Timeline data={Json} />
              <button
                className='overlay__btn'
                style={{ margin: 'auto', marginTop: '40px' }}
                id='download'
                onClick={() => {
                  uploadVideo();
                }}
              >
                Upload The Sample
              </button>
            </>
          )}
        </div>

        {start && !onFinish ? (
          <>
            <Camera
              handleVideoPlay={handleVideoPlay}
              playing={play}
              videoref={videoref}
              setintilaizing={setintilaizing}
            />
            <p className='note'>
              You are not being recorded, it all happens in your own browser!
            </p>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  );
}

export default CamMode;
