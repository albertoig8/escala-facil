import React from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/');
  };

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