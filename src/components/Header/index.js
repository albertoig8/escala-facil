// src/components/Header.js
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'; 
import { auth } from '../../firebase';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import './styles.css';

function Header() {
  const [user] = useAuthState(auth);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="header">
      <div className="header-left">
        <span className="page-name">Escala Fácil</span>
      </div>
      <div className="header-right">
        {user ? (
          <div className="user-info">
            <img className="user-photo" src={user.photoURL} alt="User" />
            <p className="user-name">{user.displayName}</p>
            <button className="logout-button" onClick={handleLogout}>
              <ExitToAppIcon />
            </button>
          </div>
        ) : (
          <>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
