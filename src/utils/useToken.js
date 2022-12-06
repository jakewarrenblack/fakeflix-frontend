import {useContext} from "react";
import {AuthContext} from "./AuthContext";

const useToken = () => {
    const {setToken, setUser} = useContext(AuthContext)

    const saveToken = userToken => {
        localStorage.setItem('token',userToken);
        setToken(userToken)
    };

    const removeToken = () => {
        localStorage.removeItem('token')
        setToken(null)
    };

    // user data
    const saveUser = userData => {
        // There doesn't seem to be much point to using JSON.stringify on this, it doesn't read properly when using JSON.parse.
        // So instead, I just decode the token when one is found in localStorage and save the user object again.
        setUser(userData)
    };

    const removeUser = () => {
        setUser(null)
    };

    return {
        setToken: saveToken,
        removeToken,

        setUser: saveUser,
        removeUser,
    }
}

export default useToken
