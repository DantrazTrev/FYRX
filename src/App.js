import './App.css';
import React, { useEffect, useRef,useState } from 'react';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {AuthProvider} from './context/AuthCon'
import { Animate } from './utils/animation';
import Cam from './pages/Cam';
import Lost from './pages/Lost';

import Library from './pages/Library';
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
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home Anim={Anim}/>} />
          <Route path='app' element={<Cam />} />
           <Route path='dashboard' element={<Library />} />
          <Route path='*' element={<Lost />}/>
         
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
