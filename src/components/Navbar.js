import {NavLink, Link, useLocation} from 'react-router-dom';
import {useContext} from "react";
import {AuthContext} from "../utils/AuthContext";
import {useAuth} from "../utils/useAuth";
import clsx from "clsx";

const Navbar = () => {
    const {token, user, loading} = useContext(AuthContext)
    const {logout} = useAuth()
    const {pathname} = useLocation()

    let links = [
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
        },
        {
            href: '/addTitle',
            name: 'Add Title',
            admin: true
        },
        {
            href: '/addAvatar',
            name: 'Add Avatar',
            admin: true
        }
    ]


    if(!user?.database_admin){
        links = links.filter((link) => !link.admin)
    }

    // Navbar position should be relative on all pages except for home (to allow scrolling for register), where it should be fixed
    return (
        <nav className={clsx("flex flex-row bg-navBlack justify-between items-center text-grey-6 py-6 px-14 font-semibold w-full z-10", pathname === '/' ? 'fixed' : 'relative')}>
            <div className={'w-1/3 flex justify-between items-center group'}>
                <Link to='/'><img className={'w-24'} src="/fakeflix.png"/></Link>
                {
                    links.map(({href, name, admin}) => (
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