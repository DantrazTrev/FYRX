import React, { useEffect, useState } from 'react';
import Card from './Card';
import Emotions from './emotions';
import Upload from './Upload';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
const Cards = ({ currTab }) => {
  const { uid } = useSelector((state) => state.firebase.auth);
  const firebase = useFirebase();
  const firestore = useFirestore();
  const [exv, setExv] = useState([]);
  const [upv, setUp] = useState([]);
  const [vid, setvid] = useState('');
  const [isPrivate, setPrivate] = useState(false);

  useEffect(() => {
    const temp = [];
    const upls = [];
    firestore
      .collection(`videos`)
      .get()
      .then((vids) => {
        vids.forEach((vid) => {
          temp.push({ id: vid.id, ...vid.data() });
          console.log('BRE', vid.data());
        });
        setExv(temp);
      });
    if (uid) {
      firestore
        .collection(`users/${uid}/videos`)
        .get()
        .then((vids) => {
          vids.forEach((vid) => {
            upls.push({ id: vid.id, ...vid.data() });
            console.log('BRE', vid.data());
          });
          setUp(upls);
        });
    }
  }, [uid]);

  if (vid !== '' && !isPrivate) {
    return <Navigate replace to={`/video?id=${vid}`} push={true} />;
  } else if (vid !== '' && isPrivate) {
    return <Navigate replace to={`/v?id=${vid}`} push={true} />;
  }
  return (
    <>
      {currTab === 'ex' && (
        <div className='Cards'>
          {exv.map((item) => {
            return (
              <Card
                key={item.id}
                item={item}
                setvid={setvid}
                setPrivate={() => setPrivate(false)}
              />
            );
          })}
        </div>
      )}
      {currTab === 'em' && (
        <div className='Cards'>
          <Emotions />
        </div>
      )}
      {currTab === 'up' && (
        <div className='Cards'>
          <Upload />{' '}
          {upv.map((item) => {
            return (
              <Card
                key={item.id}
                item={item}
                setvid={setvid}
                setPrivate={() => setPrivate(true)}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default Cards;
