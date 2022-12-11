import {NavLink, Link, useLocation} from 'react-router-dom';
import {useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../utils/AuthContext";
import {useAuth} from "../utils/useAuth";
import clsx from "clsx";
import Dropdown from "./Dropdown";
import axios from "axios";

const Navbar = ({setResults, results}) => {
    const {token, user, loading} = useContext(AuthContext)
    const {logout} = useAuth()
    const {pathname} = useLocation()
    const [searchTerm, setSearchTerm] = useState(null)


    const inputRef = useRef()

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

    useEffect(() => {
        if(searchTerm === null){
            setResults(null)
        }
        else {
            axios.get(`${process.env.REACT_APP_URL}/titles/title/${searchTerm}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                console.log(res)
                if (setResults) {
                    setResults(res.data)
                }
            }).catch((e) => {
                console.log(e)
            })
        }
    }, [searchTerm])

    const searchRoutes = ['/movies', '/shows', '/all']

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

            <div className={'w-1/3 flex justify-around items-center'}>
                <div className={clsx('flex items-center justify-end w-1/2 transition-all', !searchRoutes.find((route) => route === pathname) && 'invisible')}>
                    <div>
                        <input ref={inputRef} onChange={(e) => setSearchTerm(e.target.value)} className={'mr-5 p-1 rounded-sm'} type={'text'} name={'search'} placeholder={'Search for a title'}></input>
                    </div>
                    <button  className={'hover:cursor-pointer'}>
                        {
                        !results ? <img className={'invert'} src={'/search.png'}/> : (<button onClick={() => {
                                inputRef.current.value = null
                                setSearchTerm(null)}}>✖</button>)
                        }
                    </button>
                </div>

                {token && <Dropdown logout={logout}/>}
            </div>
        </nav>
    );
};

export default Navbar;