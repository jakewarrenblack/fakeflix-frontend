import {useContext} from "react";
import {AuthContext} from "./AuthContext";

const useToken = () => {
    const {setToken} = useContext(AuthContext)

    const saveToken = userToken => {
        localStorage.setItem('token',userToken);
        setToken(userToken)
    };

    const removeToken = () => {
        localStorage.removeItem('token')
        setToken(null)
    };

    return {
        setToken: saveToken,
        removeToken,
    }
}

export default useToken
