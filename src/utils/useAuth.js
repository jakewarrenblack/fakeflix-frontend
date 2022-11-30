import {useContext, useEffect} from 'react';
import useToken from './useToken';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "./AuthContext";

export const useAuth = () => {
    const { token, setToken, removeToken } = useToken();
    const navigate = useNavigate()
    const {setMessage} = useContext(AuthContext)

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
                navigate('/titles')
            })
            .catch((err) => {
                console.error('ERROR!!:', err);
                setToken(null)
                removeToken()

            });
    };

    const logout = (msg) => {
        removeToken()
        setMessage('Unauthorised! Please login to access that route.')
        navigate('/', msg)
    };

    return { token, login, logout };
};