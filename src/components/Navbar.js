import { Link } from 'react-router-dom';
import {useContext, useEffect} from "react";
import {AuthContext} from "../utils/AuthContext";
import {useAuth} from "../utils/useAuth";


const Navbar = (props) => {
    const {token} = useContext(AuthContext)
    const {logout} = useAuth()

    console.log('token', token)
    return (
        <nav className="flex flex-row bg-navBlack justify-between items-center text-white py-6 px-14">
            <div className={'w-1/4 flex justify-between items-center'}>
                <Link to='/'><img className={'w-24'} src="/fakeflix.png"/></Link>
                <Link to='/'>Home</Link>
                <Link to='/titles'>Films</Link>
                <Link to='/titles'>Series</Link>
                <Link to='/titles'>My List</Link>
                <Link to='/titles'>View All</Link>
            </div>
            <div className={'w-1/5 flex justify-end'}>
                {token && <button onClick={logout}>Logout</button>}
            </div>

        </nav>
    );
};

export default Navbar;