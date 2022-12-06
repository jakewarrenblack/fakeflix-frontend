import React, {useEffect} from "react"
import axios from "axios";
export const UserContext = React.createContext()

export const UserProvider = ({ token, children }) => {
    const [user, setUser] = React.useState(null)

    console.log('auth token', token)

    useEffect(() => {
        // just gets whatever user is logged in now
         axios.get(`${process.env.REACT_APP_URL}/users/profile`, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        }).then((res) => {
            console.log(res)
            setUser(res.data)
        }).catch((e) => {
            console.log(e)
            setUser(null)
        })
    }, [token])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => React.useContext(UserContext)