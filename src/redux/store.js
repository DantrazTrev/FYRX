import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/analytics';
import 'firebase/database';
import { firebaseReducer } from 'react-redux-firebase';
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore';

import { composeWithDevTools } from 'redux-devtools-extension';
const fbConfig = {
  apiKey: 'AIzaSyAIjZMtqs2-_PY5SAVIiTS4rhcONv5DEWw',
  authDomain: 'fyrv-48f6d.firebaseapp.com',
  projectId: 'fyrv-48f6d',
  storageBucket: 'fyrv-48f6d.appspot.com',
  messagingSenderId: '545438657471',
  appId: '1:545438657471:web:b0c927397c297d4c5b4f0a',
  measurementId: 'G-ET0Y3VW8X8',
};

firebase.initializeApp(fbConfig);
// Initialize other services on firebase instance
firebase.firestore(); // <- needed if using firestore
// firebase.functions() // <- needed if using httpsCallable
firebase.analytics();
firebase.storage();

firebase.database();

const allReducers = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer, // <- needed if using firestore
});

const enhancers = [composeWithDevTools()];
const store = createStore(
  allReducers,
  compose(...enhancers)
  // composeWithDevTools(applyMiddleware(logger))
);

export const rrfProps = {
  firebase,
  config: {},
  dispatch: store.dispatch,
  createFirestoreInstance, // <- needed if using firestore
};

export default store;
