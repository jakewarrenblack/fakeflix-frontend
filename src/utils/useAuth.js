import {useContext, useEffect} from 'react';
import useToken from './useToken';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { isExpired, decodeToken } from "react-jwt";
import {AuthContext} from "./AuthContext";

export const useAuth = () => {
    const {loading, setLoading} = useContext(AuthContext)
    const { setToken, removeToken, setUser, removeUser } = useToken();
    const navigate = useNavigate()

    // On render, check if we're already logged in
    useEffect(() => {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')

        if (token) {
            setToken(token)
            const decodedToken = decodeToken(token)
            setUser(decodedToken)
        }
    }, []);

    // Also need separate manual login/logout methods
    const login = async ({email, password}) => {
        await axios.post(`${process.env.REACT_APP_URL}/users/login`,
            {
                email,
                password,
            })
            .then((response) => {
                setToken(response.data.token)

                const decodedToken = decodeToken(response.data.token)

                console.log('decoded token', decodedToken)

                setUser(decodedToken)

                // If login is successful, allow the user to choose who's viewing
                // Remember, we're dealing with 'families' of users, one admin and many sub-users/child accounts
                navigate(`/selectProfile`)
            })
            .catch((err) => {
                console.error('ERROR!!:', err);
                removeToken()
                removeUser()
            }).finally(() => {
                setLoading(false)
            })
    };

    const logout = () => {
        removeToken()
        localStorage.removeItem('user')
        navigate('/')
    };

    const register = (form) => {
        axios.post(`${process.env.REACT_APP_URL}/users/register`, form)
            .then((response) => {
                // TODO: log user in automatically after registration
                //login({email: response.data.email, password: response.data.password})
                console.log(response.data);
            })
            .catch((err) => {
                console.error('ERROR!!:', err);
                alert('Error')

            });
    };

    return { login, logout, register };
};