import React ,{useEffect}from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';

const Home = ({Anim}) => {
  const Nav = useNavigate()

  return (
    <>
      <img className='Ill' src={require('../../3D.png')} />
      <div class='overlay'>
        <div class='overlay__inner'>
          <img className='logo' src={require('../../logo.png')} />
          <h1 class='overlay__title'>
            Get more insights on your
            <span class='text-gradient'> videos</span>
          </h1>
          <p class='overlay__description'>
            Get more analytical data for your videos,Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillu.<br></br>
            <strong>Plus it's all free</strong>
          </p>
          <div class='overlay__btns'>
            <button class='overlay__btn overlay__btn--transparent'>
              <a
                target='_blank'
              >
                View Tutorial
              </a>
            </button>

            <button class='overlay__btn overlay__btn--colors' onClick={()=>{Nav('app') }}>
              {' '}
            
                <span>
                  Get Started
                  <span class='overlay__btn-emoji'>🦆</span>
                </span>
            
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
