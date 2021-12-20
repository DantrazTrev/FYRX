import React from 'react';
import './index.css';

const Home = () => {
  return (
    <>
      <canvas class='orb-canvas'></canvas>{' '}
      <img
        className='Ill'
        src={require('../../3D.png')}
        loading='eager'
        alt='Illustration'
        rel='preload'
      />
      <div class='overlay'>
        <div class='overlay__inner'>
          <img
            className='logo'
            src={require('../../logo.png')}
            loading='eager'
            alt='Logo'
            rel='preload'
          />
          <h1 class='overlay__title'>
            Get more insights on your
            <span class='text-gradient'> videos</span>
          </h1>
          <p class='overlay__description'>
            Using the advanced AI engines to analyse user watch time and
            reactions dive greater into the what drives your creative career{' '}
            <br></br>
            <strong>Coming Soon</strong>
          </p>
          {/* <div class='overlay__btns'>
            <button class='overlay__btn overlay__btn--transparent'>
              <a target='_blank'>View Tutorial</a>
            </button>

            <button class='overlay__btn overlay__btn--colors'>
              {' '}
              <span>
                Coming Soon
                <span class='overlay__btn-emoji'>🦆</span>
              </span>
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Home;
