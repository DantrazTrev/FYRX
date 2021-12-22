import React, { useState, useRef } from 'react';
import '../modal.css';

import { useFirebase, useFirestore } from 'react-redux-firebase';

const LoginModal = ({ handleClose }) => {
  const firebase = useFirebase();
  const [option, setOption] = useState(1);
  const emailRef = useRef();
  const password = useRef();
  const rep_password = useRef();
  const handleSubmit = async () => {
    if (option === 1) {
      {
        await firebase.login({
          email: emailRef.current.value,
          password: password.current.value,
        });
      }
    } else {
      if (password.current.value === rep_password.current.value) {
        await firebase.createUser({
          email: emailRef.current.value,
          password: password.current.value,
          username: '',
        });
      } else
        console.log('err', password.current.value, rep_password.current.value);
    }
    handleClose();
  };

  return (
    <>
      <div className='backdrop' onClick={handleClose}></div>
      <div class='overlay modal'>
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
          <img alt='lgo' className='lgo' src={require('../login.png')} />
          <div className='modal-right'>
            <h1>{option === 1 ? 'Sign in' : 'Sign up'}</h1>

            <form
              className='account-form'
              onSubmit={(evt) => {
                evt.preventDefault();
                handleSubmit();
              }}
            >
              <div
                className={
                  'account-form-fields ' +
                  (option === 1 ? 'sign-in' : 'sign-up')
                }
              >
                <input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='E-mail'
                  ref={emailRef}
                  required
                />
                <input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='Password'
                  ref={password}
                  required={option === 1 || option === 2 ? true : false}
                />
                <input
                  id='repeat-password'
                  name='repeat-password'
                  type='password'
                  placeholder='Repeat password'
                  ref={rep_password}
                  required={option === 2 ? true : false}
                  disabled={option === 1 ? true : false}
                />
              </div>

              <div>
                {option === 1 && (
                  <div>
                    Don't have a account{' '}
                    <span
                      style={{ color: 'rgb(110 135 253)' }}
                      onClick={() => {
                        setOption(2);
                      }}
                    >
                      Signup
                    </span>
                  </div>
                )}
                {option === 2 && (
                  <div>
                    I have a account{' '}
                    <span
                      style={{ color: 'rgb(110 135 253)' }}
                      onClick={() => {
                        setOption(1);
                      }}
                    >
                      Login
                    </span>
                  </div>
                )}
              </div>
              <button
                className='overlay__btn'
                style={{ backgroundColor: 'rgb(63 84 185 / 56%)' }}
                type='submit'
              >
                {option === 1 ? 'Log in' : 'Sign up'}
              </button>
              <button
                className='overlay__btn'
                style={{ backgroundColor: 'rgb(63 84 185 / 56%)' }}
                type='submit'
              >
                <img
                  style={{ width: '20px', height: '20px', marginRight: '10px' }}
                  alt='svgImg'
                  src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTAiIGhlaWdodD0iNTAiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTg5LjQyNjU2LDE2NS4xMmMtNDMuNjMxNTYsMCAtNzkuMTMzNDQsLTM1LjQ4ODQ0IC03OS4xMzM0NCwtNzkuMTJjMCwtNDMuNjMxNTYgMzUuNTAxODcsLTc5LjEyIDc5LjEzMzQ0LC03OS4xMmMxOS43NjY1NiwwIDM4LjY4NjU2LDcuMzIzNDQgNTMuMjkzMTIsMjAuNjI2NTZsMi42NjA2MywyLjQzMjE5bC0yNi4wOTU2MywyNi4wOTU2M2wtMi40MTg3NSwtMi4wNjkzOGMtNy42NTkzNywtNi41NTc1IC0xNy40MDE1NiwtMTAuMTcyMTkgLTI3LjQzOTM3LC0xMC4xNzIxOWMtMjMuMjczNzUsMCAtNDIuMjIwNjMsMTguOTMzNDQgLTQyLjIyMDYzLDQyLjIwNzE5YzAsMjMuMjczNzUgMTguOTQ2ODgsNDIuMjA3MTkgNDIuMjIwNjMsNDIuMjA3MTljMTYuNzgzNDQsMCAzMC4wNDYyNSwtOC41NzMxMiAzNi4yOTQ2OSwtMjMuMTc5NjloLTM5LjczNDY5di0zNS42MjI4MWw3Ny41NzQ2OSwwLjEwNzVsMC41Nzc4MSwyLjcyNzgxYzQuMDQ0NjksMTkuMjAyMTkgMC44MDYyNSw0Ny40NDc4MSAtMTUuNTg3NSw2Ny42NTc4MWMtMTMuNTcxODgsMTYuNzI5NjkgLTMzLjQ1OTM4LDI1LjIyMjE5IC01OS4xMjUsMjUuMjIyMTl6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4='
                />
                {option === 1 ? 'Log in' : 'Sign up'} with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
