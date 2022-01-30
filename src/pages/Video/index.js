import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Link, useLocation, Navigate } from 'react-router-dom';
import queryString, { stringify } from 'query-string';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import Charts from '../../components/Charts';
import Timeline from '../../components/Timeline';
import { RotatingPlane } from 'better-react-spinkit';
import axios from 'axios';
function Video() {
  const location = useLocation();
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
    return <RotatingPlane color='rgb(121 121 121 / 56%)' size={55} />;
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
        {timeline.length !== 0 && <Timeline data={timeline} />}
      </div>
      <div className='charts'>
        {timeline.length === 0 ? (
          <svg width={330} height={350}>
            No data available
          </svg>
        ) : (
          <> {!add && <Charts data={timeline} />}</>
        )}
        <button
          className='overlay__btn'
          style={{ width: '100%' }}
          onClick={() => setAdd(true)}
        >
          Add a sample
        </button>
      </div>
    </>
  );
}

export default Video;
