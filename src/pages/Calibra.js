import React from 'react';
import Lottie from 'react-lottie-player';

import lottieJson from '../assets/calibra.json';
function Calibra() {
  return (
    <>
      <h1 style={{ position: 'absolute' }}>FYRX</h1>
      <Lottie
        loop
        animationData={lottieJson}
        play
        style={{ width: 669, height: 669 }}
      />
      <span style={{ textAlign: 'center', position: 'absolute', left: '39%' }}>
        We're still working on building lots of cool things <br></br> Thanks for
        wandering around ✌🏽
      </span>
    </>
  );
}

export default Calibra;
