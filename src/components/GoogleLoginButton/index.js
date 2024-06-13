import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { auth, signInWithCredential, GoogleAuthProvider } from '../../firebase';

function GoogleLoginButton({ onSuccess }) {
  const handleLoginSuccess = async (response) => {
    const credential = GoogleAuthProvider.credential(response.credential);
    try {
      await signInWithCredential(auth, credential);
      console.log('Login Successful');
      onSuccess();
    } catch (error) {
      console.error('Firebase Login Failed:', error);
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onFailure={handleLoginFailure}
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;