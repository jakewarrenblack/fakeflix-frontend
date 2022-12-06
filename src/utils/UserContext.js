import React, {useContext, useEffect} from "react"
import axios from "axios";
import {AuthContext} from "./AuthContext";
export const UserContext = React.createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = React.useState(null)
    // const {token} = useContext(AuthContext)
    const token = localStorage.getItem('token')

    console.log('auth token', token)

    useEffect(() => {

        if(token && localStorage.getItem('user')){
            setUser(JSON.parse(localStorage.getItem('user')))
        }
        else {


            // just gets whatever user is logged in now
            axios.get(`${process.env.REACT_APP_URL}/users/profile`, {

                headers: {
                    Authorization: `Bearer ${token}`
                }

            }).then((res) => {
                console.log(res)
                setUser(res.data)
                localStorage.setItem('user', JSON.stringify(res.data));
            }).catch((e) => {
                console.log(e)
                //setUser(null)
                localStorage.removeItem('user')
            })
        }
    }, [token])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => React.useContext(UserContext)