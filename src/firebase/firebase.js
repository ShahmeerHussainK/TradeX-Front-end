import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyAnLPuvbkFVbIHw6bZVlvFQXGW1fno_mek',
  authDomain: 'sweepstakes-1c6a1.firebaseapp.com',
  projectId: 'sweepstakes-1c6a1',
  storageBucket: 'sweepstakes-1c6a1.firebasestorage.app',
  messagingSenderId: '390836047107',
  appId: '1:390836047107:web:786227c249fcf4e055ed36',
  measurementId: 'G-QQN6E0NDPV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
