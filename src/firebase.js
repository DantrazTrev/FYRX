// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIjZMtqs2-_PY5SAVIiTS4rhcONv5DEWw",
  authDomain: "fyrv-48f6d.firebaseapp.com",
  projectId: "fyrv-48f6d",
  storageBucket: "fyrv-48f6d.appspot.com",
  messagingSenderId: "545438657471",
  appId: "1:545438657471:web:b0c927397c297d4c5b4f0a",
  measurementId: "G-ET0Y3VW8X8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth()
export default app