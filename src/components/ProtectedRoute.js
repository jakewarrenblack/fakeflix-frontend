import React, {useContext} from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {AuthContext} from "../utils/AuthContext";

function ProtectedRoute () {
    const {token} = useContext(AuthContext)
    const location = useLocation()

    console.log('Protected route token: ', token)

    // If no token received from auth context, redirect to the login page
    // Otherwise, go to the protected route
    return (
        token ? <Outlet />
        : <Navigate to="/" state={{ from: location }} replace />
    );
}

export default ProtectedRoute