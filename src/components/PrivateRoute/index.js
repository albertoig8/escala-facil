import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

function PrivateRoute() {
    const [user, loading] = useAuthState(auth);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        if (!loading) {
            setAuthChecked(true);
        }
    }, [loading]);

    if (!authChecked) {
        return <></>;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
