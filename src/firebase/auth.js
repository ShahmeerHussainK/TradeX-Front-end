import axiosInstance from "@/api/axios";
import { auth } from "./firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";


export const login = async(accessToken)=>{
  return axiosInstance.post('/login',accessToken)
}

export const register= async (payload) => {
  const result = await axiosInstance.post(`/register`,payload)
  return result.data;
};

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = async(email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};
const googleSignup = async(token)=>{
  return await axiosInstance.post(`/google_signup`,null,{
    headers: { Authorization: `Bearer ${token}`},
  })
}

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  await googleSignup(result.user.accessToken)
  return result;
};

export const doSignOut = () => {
  return auth.signOut();
};

// export const doPasswordReset = (email) => {
//     return sendPasswordResetEmail(auth, email);
// }

// export const doPasswordChange = (password) => {
//     return updatePassword(auth.currentUser, password)
// }

// export const doSendEmailVerification = () => {
//     return sendEmailVerification(auth.currentUser, {
//         url: `${window.location.origin}/home`
//     })
// }
