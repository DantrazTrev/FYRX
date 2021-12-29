import React from 'react';
import { useNavigate } from 'react-router-dom';
function Upload() {
  const Nav = useNavigate();
  return (
    <>
      <div
        className='card'
        onClick={() => {
          Nav('/watch');
        }}
      >
        <img className='ico' alt='ico' src={require('../assets/add.png')} />
      </div>
    </>
  );
}

export default Upload;
