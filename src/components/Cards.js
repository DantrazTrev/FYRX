import React, { useEffect, useState } from 'react';
import Card from './Card';
import Emotions from './emotions';
import Upload from './Upload';
import { useFirebase, useFirestore } from 'react-redux-firebase';
const Cards = ({ currTab }) => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const [exv, setExv] = useState([]);

  useEffect(() => {
    const temp = [];
    firestore
      .collection(`videos`)
      .get()
      .then((vids) => {
        vids.forEach((vid) => {
          temp.push(vid.data());
          console.log('BRE', vid.data());
        });
        setExv(temp);
      });
  }, []);

  return (
    <>
      {currTab === 'ex' && (
        <div className='Cards'>
          {exv.map((item) => {
            return <Card item={item} />;
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
