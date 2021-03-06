import * as faceapi from 'face-api.js';
import { useState, useRef, useEffect } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
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
                <div class='progress'>
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
            {url && !intilaizing && (
              <>
                <ReactPlayer
                  className='react-player'
                  playing={play && !intilaizing}
                  height={501}
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
                  <div class='progress'>
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
            >
              <label
                for='file'
                style={{
                  backgroundColor: 'rgb(30 30 30 / 56%)',
                  color: 'rgb(255 255 255 / 78%)',
                }}
                className='overlay__btn'
              >
                Choose Video
              </label>
              <form
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
                onSubmit={onSubmit}
              >
                <input
                  type='url'
                  style={{
                    backgroundColor: 'rgb(30 30 30 / 56%)',
                    color: 'rgb(255 255 255 / 78%)',
                    display: 'block',
                    textAlign: 'center',
                  }}
                  ref={urlref}
                  className='overlay__btn'
                  placeholder=' Use Link (beta)'
                />
              </form>
            </div>
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
              downloadFile();
            }}
          />
          <input
            type='file'
            id='file'
            style={{ display: 'none' }}
            onChange={changeHandler}
            accept='video/mp4'
          />
        </div>

        {start && !onFinish ? (
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
      {modal && (
        <UploadModal
          handleClose={() => {
            setModal(false);
          }}
          Uploadfile={uploadVideo}
        />
      )}
    </>
  );
}

export default Cam;
