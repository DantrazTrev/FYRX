import React, { useState } from 'react';
import Card from './Card';
import { Navigate } from 'react-router-dom';
function Emotion({ filter, filteredUpls }) {
  const emotions = [
    { emoji: '😀', name: 'Happy', color: '#6a6a00' },
    { emoji: '😭', name: 'Sad', color: 'blue' },
    { emoji: '😡', name: 'Angry', color: 'red' },
    { emoji: '😳', name: 'Suprised', color: 'black' },
    { emoji: '😣', name: 'Disgusted', color: 'pink' },
    { emoji: '😐', name: 'Neutral', color: 'orange' },
    { emoji: '😱', name: 'fearful', color: 'black' },
  ];
  const [vid, setvid] = useState('');
  if (vid !== '') {
    return <Navigate replace to={`/video?id=${vid}`} push={true} />;
  }
  if (filteredUpls.length !== 0)
    return (
      <>
        <button className='back-btn' onClick={() => filter('')}>
          <img width={30} src='https://img.icons8.com/ios/96/ffffff/left.png' />
        </button>
        <div className='Cards'>
          {filteredUpls.map((item) => {
            return <Card key={item.id} item={item} setvid={setvid} />;
          })}
        </div>
      </>
    );

  return (
    <>
      {emotions.map((emotion, idx) => {
        return (
          <div
            style={{ backgroundColor: '#ffc100', fontSize: '2rem' }}
            className='card'
            onClick={() => filter(idx)}
          >
            <div
              style={{ position: 'absolute', left: '10px', fontSize: '5rem' }}
            >
              {' '}
              {emotion.emoji}
            </div>
            <div
              style={{ position: 'absolute', right: '15px', bottom: '10px' }}
            >
              {emotion.name}
            </div>
          </div>
        );
      })}
    </>
  );
}
export default Emotion;
