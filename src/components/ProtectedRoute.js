import React, {useContext, useEffect, useState} from "react";
import {Navigate, Outlet, useLocation, redirect} from "react-router-dom";
import {AuthContext} from "../utils/AuthContext";
import {UserContext, useUser} from "../utils/UserContext";

function ProtectedRoute () {
    const {token} = useContext(AuthContext)
    const location = useLocation()

    const {user} = useContext(UserContext)
    // user will have one of the following subscription types: 'Movies', 'Shows', 'Movies & Shows'
    console.log('user from context', user)

    // User isn't even logged in, go back to the home page
    if(!token){
        return <Navigate
            to={'/'}
            state={{msg: 'Please sign in to access that page.'}}
        />
    }

    /// if we're going to the /movies path, and the user is not subscribed to either 'movies' or 'movies & shows'
    if((location.pathname == '/movies' || location.pathname == '/shows') && !user?.subscription?.toLowerCase().includes(location.pathname)){
        return <Navigate
            to={'/'}
            state={{msg: `Sorry, ${location.pathname.replace('/', '')} are not included in your plan.`}}
        />
    }

    // if user tries to view /all, which is a combination of shows and movies, they need to be subscribed to both
    if(location.pathname == '/all' && user?.subscription != 'Movies & Shows'){
        return <Navigate
            to={'/'}
            state={{msg: `Sorry, your plan only includes ${user?.subscription?.toLowerCase()}.`}}
        />
    }



    // If no token received from auth context, redirect to the login page
    // Otherwise, go to the protected route
    return (
        <Outlet />
    );
}

export default ProtectedRoute