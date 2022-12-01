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
    const login = ({email, password}) => {
        console.log(email)
        axios.post(`${process.env.REACT_APP_URL}/users/login`, {email,
           password
        })
            .then((response) => {
                console.log(response.data);
                setToken(response.data.token)
                // If login is successful, go to the /titles page
                navigate('/movies')
            })
            .catch((err) => {
                console.error('ERROR!!:', err);
                setToken(null)
                removeToken()

            });
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