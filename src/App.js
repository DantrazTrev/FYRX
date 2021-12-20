import './App.css';
import React, { useEffect, useRef } from 'react';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Animate } from './utils/animation';
import Cam from './pages/Cam';
function App() {
  const canvasRef = useRef();
  useEffect(() => {
    Animate(canvasRef);
  }, []);
  return (
    <>
      <canvas ref={canvasRef} class='orb-canvas'></canvas>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='app' element={<Cam />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
