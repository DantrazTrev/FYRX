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
  const [selectedFile, setSelectedFile] = useState();
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

  useEffect(() => {
    if (vidId) {
      firestore
        .doc(`videos/${vidId}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setSelectedFile(doc.data().src);
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
            setSelectedFile(doc.data().src);
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
    const blob = new Blob([time_copy], { type: 'application/json' });
    if (vidId) {
      await firebase.storage().ref(`videos/${vidId}/metadata.json`).put(blob);
      navigator(`/video?id=${vidId}`);
    } else if (vuid && uid) {
      await firebase
        .storage()
        .ref(`users/${uid}/videos/${vuid}/metadata.json`)
        .put(blob);
      navigator(`/v?id=${vidId}`);
    }
  };

  const handleVideoPlay = () => {
    intervalref.current = setInterval(async () => {
      if (intilaizing) {
        setintilaizing(false);
      }
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
          setdetection(toHHMMSS(player.current.currentTime) + ' ' + status);
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
    setTimeout(() => {
      player.current.play();
    }, 500);
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
            {selectedFile && (
              <>
                <video
                  ref={player}
                  height={501}
                  width={906}
                  style={{ borderRadius: '20px', objectFit: 'cover' }}
                  onPlay={() => {
                    setPlay(true);
                  }}
                  onEnded={() => {
                    setFinish(true);
                  }}
                >
                  <source src={selectedFile} id='video' type='video/mp4' />
                </video>
                <div class='progress' ref={progress}>
                  <div
                    class='progress-filled'
                    style={
                      play
                        ? {
                            width: `${
                              (player.current.currentTime /
                                player.current.duration) *
                              100
                            }%`,
                          }
                        : {}
                    }
                  ></div>
                </div>
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
            <div className='text'>{detection}</div>
          )}
          {onFinish && (
            <label className='overlay__btn' for='download'>
              Upload Video
            </label>
          )}
          <button
            style={{ display: 'none' }}
            className='overlay__btn'
            id='download'
            onClick={() => {
              uploadVideo();
            }}
          />
        </div>

        {start ? (
          <>
            <Camera
              handleVideoPlay={handleVideoPlay}
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
