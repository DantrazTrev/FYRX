import './App.css';
import React from 'react';
import Home from './pages/Home';
import { Animate } from './utils/animation';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  Animate();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
