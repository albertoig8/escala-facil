import React from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import { auth, db } from '../../firebase';
import { getFirestore, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = async () => {
    const user = auth.currentUser;
    console.log(user);
    const { uid, displayName, photoURL, email } = user;

    await saveUserToFirestore(uid, displayName, photoURL, email);
    navigate('/');
  };

  async function saveUserToFirestore(uid, displayName, photoURL, email) {
    const usersCollectionRef = collection(db, 'users');
    const userDocRef = doc(usersCollectionRef, uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      await setDoc(userDocRef, {
        uid,
        displayName,
        photoURL,
        email,
      });
    } else {

    }
  }

  return (
    <div className="login-container">
      <div className="login-inner-container">
        <h1 className="title">Este é</h1>
        <p className="subtitle">um novo jeito de organizar as escalas do ministerio</p>
        <GoogleLoginButton onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}

export default Login;