'use client'
import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult, signInWithPopup } from "firebase/auth";
import { firebaseApp } from "utils/firebase";
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginButton = () => {
  const auth = getAuth(firebaseApp);
  const router = useRouter();

  const handleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      router.push('/') 
    }).catch((error) => {
      console.error('error signing in with google', error)
    })
  }
  
  return (
    <button onClick={() => handleLogin()} className="bg-gradient-to-r from-revolver-800 to-ebony-800 text-white font-bold py-2 px-4 rounded h-10 w-75 flex items-center justify-center">
      <FontAwesomeIcon icon={faGoogle} className="mr-2" />
      Sign-in with Google
    </button>
  )
}

export default LoginButton;