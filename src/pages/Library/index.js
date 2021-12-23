import React, { useState } from 'react';
import './index.css';
import Sidebar from '../../components/Sidebar';
import LoginModal from '../../components/LoginModal';
import Cards from '../../components/Cards';
import { useSelector, useDispatch } from 'react-redux';
import { useFirebase, useFirestore } from 'react-redux-firebase';
function Library() {
  const firebase = useFirebase();

  const { uid, email } = useSelector((state) => state.firebase.auth);

  const [loginModal, setModal] = useState(false);
  const [currTab, setTab] = useState('ex');
  return (
    <>
      <nav className='nav'>
        <h3>Library</h3>
        <div
          className='login'
          onClick={() => {
            if (uid) firebase.logout();
            else setModal(!loginModal);
          }}
        >
          {uid ? 'Log Out' : 'Log In / Sign up'}
        </div>
      </nav>

      <Sidebar currTab={currTab} setTab={setTab} />
      <main className='main'>
        <Cards currTab={currTab} />
      </main>
      {loginModal && (
        <LoginModal
          handleClose={() => {
            setModal(false);
          }}
        />
      )}
    </>
  );
}

export default Library;
