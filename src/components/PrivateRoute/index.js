// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

function PrivateRoute() {
    const [user] = useAuthState(auth);

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
