import React, { useEffect, useState } from 'react';
import Card from './Card';
import Emotions from './emotions';
import Upload from './Upload';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { Navigate } from 'react-router-dom';
const Cards = ({ currTab }) => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const [exv, setExv] = useState([]);
  const [vid, setvid] = useState('');

  useEffect(() => {
    const temp = [];
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
  }, []);

  if (vid !== '') {
    return <Navigate replace to={`/video?id=${vid}`} push={true} />;
  }

  return (
    <>
      {currTab === 'ex' && (
        <div className='Cards'>
          {exv.map((item) => {
            return <Card key={item.id} item={item} setvid={setvid} />;
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
          <Upload />
        </div>
      )}
    </>
  );
};

export default Cards;
