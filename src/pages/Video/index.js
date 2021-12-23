import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Link, useLocation } from 'react-router-dom';
import queryString, { stringify } from 'query-string';
import { useFirebase, useFirestore } from 'react-redux-firebase';

function Video({}) {
  const location = useLocation();
  const firestore = useFirestore();
  const [vidId, setVidId] = useState(
    queryString.parse(location.search, {
      parseNumbers: true,
      parseBooleans: true,
    }).id
  );
  const [src, setSrc] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    firestore
      .doc(`videos/${vidId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setSrc(doc.data().src);
          setLoading(false);
        }
      });
  }, [vidId]);

  if (loading === true) {
    return <div></div>;
  }
  return (
    <div className='videoPlayer'>
      <ReactPlayer url={src} controls={true} />
    </div>
  );
}

export default Video;
