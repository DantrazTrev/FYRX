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
import Calibra from './pages/Calibra';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';

function App() {
  const [Anim, setAnim] = useState();
  const canvasRef = useRef();
  
  useEffect(() => {
    setAnim(Animate(canvasRef));
  }, []);
  
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-bg dark:via-dark-bg dark:to-black text-gray-900 dark:text-white transition-colors duration-300">
        <canvas ref={canvasRef} className='orb-canvas'></canvas>
        
        <Provider store={store}>
          <ReactReduxFirebaseProvider {...rrfProps}>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={
                  <>
                    <Navigation showAuth={true} />
                    <Home Anim={Anim} />
                  </>
                } />
                <Route path='watch' element={
                  <>
                    <Navigation />
                    <Cam />
                  </>
                } />
                <Route path='app' element={
                  <>
                    <Navigation />
                    <CamMode />
                  </>
                } />
                <Route path='dashboard' element={
                  <>
                    <Navigation />
                    <Library />
                  </>
                } />
                <Route path='video' element={
                  <>
                    <Navigation />
                    <Video />
                  </>
                } />
                <Route path='v' element={
                  <>
                    <Navigation />
                    <MyVideo />
                  </>
                } />
                <Route path='*' element={
                  <>
                    <Navigation />
                    <Calibra />
                  </>
                } />
              </Routes>
            </BrowserRouter>
          </ReactReduxFirebaseProvider>
        </Provider>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: isDarkMode => isDarkMode ? '#1f1f1f' : '#fff',
              color: isDarkMode => isDarkMode ? '#fff' : '#333',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: isDarkMode => isDarkMode ? '#333' : '#e5e7eb',
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;