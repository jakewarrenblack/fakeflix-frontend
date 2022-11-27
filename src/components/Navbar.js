import { Link } from 'react-router-dom';
import {useContext, useEffect} from "react";
import {AuthContext} from "../utils/AuthContext";
import {useAuth} from "../utils/useAuth";


const Navbar = (props) => {
    const {token} = useContext(AuthContext)
    const {logout} = useAuth()

    console.log('token', token)
    return (
        <div>
            <Link to='/'>Home</Link> | 
            <Link to='/titles'>Titles</Link>
            {token && <button onClick={logout}>Logout</button>}
        </div>
    );
};

export default Navbar;