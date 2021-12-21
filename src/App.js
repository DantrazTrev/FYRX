import './App.css';
import React, { useEffect, useRef,useState } from 'react';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Animate } from './utils/animation';
import Cam from './pages/Cam';
import Lost from './pages/Lost';
function App() {
  const [Anim,setAnim]= useState()
  const canvasRef = useRef();
  useEffect(() => {
    setAnim(Animate(canvasRef));
  }, []);
  return (
    <>
      <canvas ref={canvasRef} class='orb-canvas'></canvas>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home Anim={Anim}/>} />
          <Route path='app' element={<Cam />} />
          <Route path='*' element={<Lost />}/>
         
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
