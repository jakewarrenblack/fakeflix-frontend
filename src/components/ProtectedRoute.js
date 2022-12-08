import React, {useContext, useEffect, useState} from "react";
import {Navigate, Outlet, useLocation, redirect} from "react-router-dom";
import {AuthContext} from "../utils/AuthContext";
import {UserContext, useUser} from "../utils/UserContext";
import useToken from "../utils/useToken";

function ProtectedRoute () {
    const {user, loading} = useContext(AuthContext)
    const token = localStorage.getItem('token')
    const location = useLocation()
    // user will have one of the following subscription types: 'Movies', 'Shows', 'Movies & Shows'
    // User isn't even logged in, go back to the home page

        if (!token) {
            console.log(location.pathname)
            return <Navigate
                to={'/'}
                state={{msg: 'Please sign in to access that page.'}}
            />
        }

        // if there is a token, I need it to wait for the user to load.
        // if the user has just refreshed the page (for whatever reason), we won't immediately know what their subscription type is.
        // not waiting would mean we'd always think routes were unauthorised.

        // so if the user has loaded, now we're ready to find out what type of subscription they have
        if(!loading) {
            // if we're going to the /movies path, and the user is not subscribed to either 'movies' or 'movies & shows'
            if ((location.pathname == '/movies' || location.pathname == '/shows') && !user?.subscription?.toLowerCase().includes(location.pathname.replace('/', ''))) {
                return <Navigate
                    to={'/'}
                    state={{msg: `Sorry, ${location.pathname.replace('/', '')} are not included in your plan.`}}
                />
            }

            // if user tries to view /all, which is a combination of shows and movies, they need to be subscribed to both
            if (location.pathname == '/all' && user?.subscription != 'Movies & Shows') {
                return <Navigate
                    to={'/'}
                    state={{msg: `Sorry, your plan only includes ${user?.subscription?.toLowerCase()}.`}}
                />
            }
        }


        // If no token received from auth context, redirect to the login page
        // Otherwise, go to the protected route
        return (
            <Outlet/>
        );

}

export default ProtectedRoute