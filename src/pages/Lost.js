import React from 'react';
import './Home/index.css';
import { Link } from 'react-router-dom';

const Lost = () => {
  return (
    <>
      <img alt='Ill' className='Ill' src={require('../assets/404.png')} />

      <div
        class='overlay__inner'
        style={{ position: 'absolute', right: '10%', top: '30%' }}
      >
        <h1 class='overlay__title' style={{ color: 'white', fontSize: '4rem' }}>
          This is no place for <br /> <br />
          <span class='text-gradient'> surfing</span>
          <br />
          <br />
          <Link
            className='overlay__btn'
            style={{
              padding: '2rem',
              transform: 'translate(5rem)',
              fontSize: '1rem',
            }}
            to='/'
          >
            Go Home
          </Link>
          <br />
          <br />
        </h1>
      </div>
    </>
  );
};

export default Lost;
