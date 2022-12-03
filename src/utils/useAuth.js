import {useContext, useEffect} from 'react';
import useToken from './useToken';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "./AuthContext";

export const useAuth = () => {
    const { token, setToken, removeToken } = useToken();
    const navigate = useNavigate()

    // On render, check if we're already logged in
    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
            setToken(token)
        }
    }, []);

    // Also need separate manual login/logout methods
    let adminId;
    const login = async ({email, password}) => {
        // if we were directed to login after registering, and a sub-user just registered,
        // we will have an admin id
        // otherwise, either an admin just registered, or somebody is logging in (we don't know what their account type is yet)

        let adminID

            // don't need to pass params here, it will search by the currently logged in user
            await axios.post(`http://localhost:3000/api/users/getProfileByEmail/`, {
                email
            }).then((res) => {

                console.log('Getting profile by email...')

                if(res.data.type === 'admin'){
                    // if user logging in turns out to be an admin, use their main ID
                    adminID = res.data._id
                }
                // otherwise, a sub-user is logging in, use their admin ID
                // (this way, we'll return profiles where '_id' matches, and where 'admin' matches
                // so we get the entire 'family' of users
                else{
                    adminID = res.data.admin
                }


                axios.post(`${process.env.REACT_APP_URL}/users/login`,
                    {
                        email,
                        password,
                    })
                    .then((response) => {
                        setToken(response.data.token)
                        // If login is successful, allow the user to choose who's viewing
                        // Remember, we're dealing with 'families' of users, one admin and many sub-users/child accounts

                        navigate(`/selectProfile`, {
                            state: {
                                adminID
                            }
                        })

                    })
                    .catch((err) => {
                        console.error('ERROR!!:', err);
                        setToken(null)
                        removeToken()

                    });

            }).catch((e) => console.log(e))



    };

    const logout = () => {
        removeToken()
        navigate('/')
    };

    const register = (form) => {
        axios.post(`${process.env.REACT_APP_URL}/users/register`, form)
            .then((response) => {
                //login({email: response.data.email, password: response.data.password})
                console.log(response.data);
            })
            .catch((err) => {
                console.error('ERROR!!:', err);
                alert('Error')

            });
    };

    return { token, login, logout, register };
};