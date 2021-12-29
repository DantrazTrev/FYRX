import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Animate } from './utils/animation';
import Cam from './pages/Cam';
import Lost from './pages/Lost';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { Provider } from 'react-redux';
import store, { rrfProps } from './redux/store';
import Library from './pages/Library';
import Video from './pages/Video';
import MyVideo from './pages/MyVideo';
import CamMode from './pages/CamMode';
function App() {
  const [Anim, setAnim] = useState();
  const canvasRef = useRef();
  useEffect(() => {
    setAnim(Animate(canvasRef));
  }, []);
  return (
    <>
      <canvas ref={canvasRef} class='orb-canvas'></canvas>

      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home Anim={Anim} />} />
              <Route path='watch' element={<Cam />} />
              <Route path='app' element={<CamMode />} />
              <Route path='dashboard' element={<Library />} />
              <Route path='video' element={<Video />} />
              <Route path='v' element={<MyVideo />} />
              <Route path='*' element={<Lost />} />
            </Routes>
          </BrowserRouter>
        </ReactReduxFirebaseProvider>
      </Provider>
    </>
  );
}

export default App;
