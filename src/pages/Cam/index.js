import * as faceapi from 'face-api.js';
import { useState, useRef, useEffect } from 'react';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import Camera from '../../components/camera';
import UploadModal from '../../components/UploadModal';
import { useSelector } from 'react-redux';
import './index.css';
import { ARRAY_MAP } from '../../data/';

function Cam() {
  const [intilaizing, setintilaizing] = useState(false);
  const videoref = useRef();
  const player = useRef();
  const progress = useRef();
  const firestore = useFirestore();
  const firebase = useFirebase();
  const [start, setStart] = useState(false);
  const [play, setPlay] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [detection, setdetection] = useState('');
  const [Json, setJson] = useState([]);
  const [onFinish, setFinish] = useState(false);
  const [modal, setModal] = useState(false);
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

  const uploadVideo = async (isPrivate, filename) => {
    const json = JSON.stringify(Json);
    const blob = new Blob([json], { type: 'application/json' });
    if (isPrivate) {
      let vidId;
      await firestore
        .collection(`users/${uid}/videos`)
        .add({
          name: filename,
          src: '',
          data: '',
          isPrivate: true,
        })
        .then((res) => {
          vidId = res.id;
        });
      await firebase
        .storage()
        .ref(`users/${uid}/videos/${vidId}/metadata.json`)
        .put(blob);
      let data = await firebase
        .storage()
        .ref(`users/${uid}/videos/${vidId}/metadata.json`)
        .getDownloadURL();
      await firebase
        .storage()
        .ref(`users/${uid}/videos/${vidId}/video.mp4`)
        .put(selectedFile);
      let src = await firebase
        .storage()
        .ref(`users/${uid}/videos/${vidId}/video.mp4`)
        .getDownloadURL();
      await firestore.doc(`users/${uid}/videos/${vidId}`).update({
        src: src,
        data: data,
      });
    } else {
      let vidId;
      await firestore
        .collection(`videos`)
        .add({
          name: filename,
          src: '',
          data: '',
          isPrivate: false,
        })
        .then((res) => {
          vidId = res.id;
        });
      await firebase.storage().ref(`videos/${vidId}/metadata.json`).put(blob);
      let data = await firebase
        .storage()
        .ref(`videos/${vidId}/metadata.json`)
        .getDownloadURL();
      await firebase.storage().ref(``).put(selectedFile);
      let src = await firebase
        .storage()
        .ref(`videos/${vidId}/video.mp4`)
        .getDownloadURL();
      await firestore.doc(`videos/${vidId}`).update({
        src: src,
        data: data,
      });
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
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setStart(true);
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
                    setModal(true);
                  }}
                >
                  <source
                    src={URL.createObjectURL(selectedFile)}
                    id='video'
                    type='video/mp4'
                  />
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
              <label
                for='file'
                style={{
                  backgroundColor: 'rgb(30 30 30 / 56%)',
                  color: 'rgb(255 255 255 / 78%)',
                }}
                className='overlay__btn'
              >
                Use Link
              </label>
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
