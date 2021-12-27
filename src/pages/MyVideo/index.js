import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Link, useLocation } from 'react-router-dom';
import queryString, { stringify } from 'query-string';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import Charts from '../../components/Charts';
import { useSelector } from 'react-redux';
import Timeline from '../../components/Timeline';
import axios from 'axios';
function MyVideo({ isPrivate }) {
  const { uid } = useSelector((state) => state.firebase.auth);
  const location = useLocation();
  const firestore = useFirestore();
  const firebase = useFirebase();
  const player = useRef();
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
  const [timeline, setTimeline] = useState([]);
  useEffect(() => {
    if (uid) {
      firestore
        .doc(`users/${uid}/videos/${vidId}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setVdata(doc.data());
          } else {
          }
        });
      firebase
        .storage()
        .ref(`users/${uid}/videos/${vidId}/metadata.json`)
        .getDownloadURL()
        .then((url) => {
          axios(url).then((res) => {
            setTimeline(res.data);
            setTimeout(() => {
              setLoading(false);
            }, 500);
          });
        });
    }
  }, [vidId, uid]);

  useEffect(() => {
    setPlaying(false);
  }, [ready]);
  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    setProgress(state);
  };
  if (loading === true) {
    return <div></div>;
  }

  return (
    <>
      <div className='videoPlayer'>
        <ReactPlayer
          className='react-player'
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
        <div class='progress' ref={progress}>
          <div
            class='progress-filled'
            style={{
              width: `${progress.played * 100}%`,
            }}
          ></div>
        </div>

        <div className='controls'>
          {playing ? (
            <img
              onClick={() => setPlaying(false)}
              className='controlsIcon--small'
              alt=''
              src='/pause.svg'
            />
          ) : (
            <img
              onClick={() => setPlaying(true)}
              className='controlsIcon--small'
              alt=''
              src='/play.svg'
            />
          )}
        </div>
        <h2>{vdata.name}</h2>

        <Timeline data={timeline} />
      </div>
      <div className='charts'>
        <Charts data={timeline} />
      </div>
      <div className='charts-timeline'></div>
    </>
  );
}

export default MyVideo;
