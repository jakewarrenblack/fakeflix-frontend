import { NavLink, Link } from 'react-router-dom';
import {useContext} from "react";
import {AuthContext} from "../utils/AuthContext";
import {useAuth} from "../utils/useAuth";

const Navbar = () => {
    const {token} = useContext(AuthContext)
    const {logout} = useAuth()

    const links = [
        {
            href: '/',
            name: 'Home'
        },
        {
            href: '/movies',
            name: 'Movies'
        },
        {
            href: '/shows',
            name: 'Shows'
        },
        {
            href: '/my_list',
            name: 'My List'
        },
        {
            href: '/all',
            name: 'View All'
        }
    ]

    console.log('token', token)
    return (
        <nav className="flex flex-row bg-navBlack justify-between items-center text-grey-6 py-6 px-14 font-semibold fixed w-screen z-10">
            <div className={'w-1/4 flex justify-between items-center group'}>
                <Link to='/'><img className={'w-24'} src="/fakeflix.png"/></Link>
                {
                    links.map(({href, name}) => (
                        <NavLink key={name} className={({isActive}) => isActive ? 'text-white' : 'hover:text-grey-5'} to={href}>{name}</NavLink>
                    ))
                }
            </div>
            <div className={'w-1/5 flex justify-end'}>
                {token && <button onClick={logout}>Logout</button>}
            </div>

        </nav>
    );
};

export default Navbar;