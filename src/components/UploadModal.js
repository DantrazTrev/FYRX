import React, { useState, useRef } from 'react';
import '../modal.css';
import lottieJson from '../assets/upload.json';
import { useFirebase, useFirestore } from 'react-redux-firebase';
import { ThreeBounce } from 'better-react-spinkit';
import Lottie from 'react-lottie-player';

const UploadModal = ({ handleClose, Uploadfile }) => {
  const [err, seterr] = useState(null);
  const [priv, setPrivate] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const nameRef = useRef();
  const [loading, setLoading] = useState(false);
  const upload = async () => {
    if (nameRef.current.value !== '') {
      setLoading(true);
      Uploadfile(priv, nameRef.current.value).then(() => {
        handleClose();
      });
    }
  };

  return (
    <>
      <div className='backdrop' onClick={handleClose}></div>
      <div class='overlay modal' style={{ height: '70%' }}>
        <div class='overlay__inner'>
          <img
            style={{
              position: 'absolute',
              right: '20px',
              top: '20px',
              cursor: 'pointer',
            }}
            onClick={handleClose}
            alt='svgImg'
            src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMjQiIGhlaWdodD0iMjQiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTMzLjczMzcyLDIzLjU5OTYxbC0xMC4xMzQxMSwxMC4xMzQxMWw1Mi4yNjYyOCw1Mi4yNjYyOGwtNTIuMjY2MjgsNTIuMjY2MjhsMTAuMTM0MTEsMTAuMTM0MTFsNTIuMjY2MjgsLTUyLjI2NjI4bDUyLjI2NjI4LDUyLjI2NjI4bDEwLjEzNDExLC0xMC4xMzQxMWwtNTIuMjY2MjgsLTUyLjI2NjI4bDUyLjI2NjI4LC01Mi4yNjYyOGwtMTAuMTM0MTEsLTEwLjEzNDExbC01Mi4yNjYyOCw1Mi4yNjYyOHoiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg=='
          />{' '}
          {/* <img
            alt='lgo'
            className='lgo'
            style={{ width: '500px' }}
            src={require('../assets/upload.png')}
          /> */}
          <Lottie
            loop
            animationData={lottieJson}
            play={loading}
            style={{ width: 400, height: 400, top: 0, position: 'absolute' }}
          />
          <div className='modal-right'>
            <h1>Upload</h1>

            <form
              className='account-form'
              onSubmit={(evt) => {
                evt.preventDefault();
              }}
            >
              <div className={'account-form-fields sign-in'}>
                <label for='name'>
                  <h3>File Name</h3>
                </label>
                <input
                  id='name'
                  name='name'
                  type='name'
                  placeholder=''
                  style={{
                    backgroundColor: 'rgb(10 10 10 / 56%)',
                    border: '1px solid rgb(169 165 165 / 56%)',
                    borderRadius: '10px',
                    color: 'white',
                  }}
                  ref={nameRef}
                  required
                />
              </div>
              <span style={{ color: 'red' }}>{err}</span>
              <div>
                <label for='private'>
                  <h3>Private</h3>
                </label>
                <input
                  checked={priv}
                  onChange={() => {
                    setPrivate(!priv);
                  }}
                  id='private'
                  type='checkbox'
                  className='toggle'
                />
              </div>
              <button
                className='overlay__btn'
                style={{ backgroundColor: 'rgb(63 84 185 / 56%)' }}
                type='submit'
                onClick={() => {
                  upload();
                }}
              >
                {loading ? <ThreeBounce color={'white'} /> : 'Upload'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadModal;
