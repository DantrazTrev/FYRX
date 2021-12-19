import './App.css';
import React, { useEffect } from 'react';
import Home from './pages/Home';
import { Animate } from './utils/animation';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Library from './pages/library';
function App() {
  Animate();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='app' element={<Library />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
