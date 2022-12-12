import {NavLink, Link, useLocation} from 'react-router-dom';
import {useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../utils/AuthContext";
import {useAuth} from "../utils/useAuth";
import clsx from "clsx";
import Dropdown from "./Dropdown";
import axios from "axios";
import { useDebouncedEffect } from '@react-hookz/web'

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

    useDebouncedEffect(() => {
        if(searchTerm === null){
            setResults(null)
        }
        else {
            // Returns max 5 by default, I find the top 5 are generally the most relevant of the results.
            axios.get(`${process.env.REACT_APP_URL}/titles/title/${searchTerm}?limit=10`, {
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
        // Perform the check 200ms after the last change, but at least once every 500ms
    },[searchTerm], 500);

    const searchRoutes = ['/movies', '/shows', '/all']

    if(!user?.database_admin){
        links = links.filter((link) => !link.admin)
    }

    useEffect(() => {
        if(!searchRoutes.find((route) => route === pathname)){
            // if user navigates to some other route, clear the search
            inputRef.current.value = null
            setSearchTerm(null)
        }
    }, [pathname])

    const [showLinks, setShowLinks] = useState(false)

    if(pathname !== '/'){
        document.title = pathname.toUpperCase().replace('/', '').replace('_', ' ')
    }
    else{
        document.title = 'FakeFlix | Home'
    }



    // Navbar position should be relative on all pages except for home (to allow scrolling for register), where it should be fixed
    return (
        <nav className={clsx("flex-col justify-center flex sm:flex-row bg-navBlack sm:justify-between items-center text-grey-6 py-6 px-14 font-semibold w-full z-10", pathname === '/' ? 'fixed' : 'relative')}>
            <div className={'flex-col justify-center w-full sm:w-1/3 flex sm:flex-row sm:justify-between items-center group '}>
                <div className={clsx('flex items-center w-full sm:w-max justify-between', showLinks && 'mb-10')}>
                <Link to='/'><img className={'w-24'} src="/fakeflix.png"/></Link>
                <button onClick={() => setShowLinks(!showLinks)} className={'block sm:hidden text-white '}>≡</button>
                </div>
                <>
                {
                    links.map(({href, name, admin}) => (
                        <div className={clsx('sm:block', showLinks ? 'block' : 'hidden')}><NavLink key={name} className={({isActive}) => isActive ? 'text-white' : 'hover:text-grey-5'} to={href}>{name}</NavLink></div>
                    ))
                }
                </>
            </div>

            <div className={clsx('flex flex-col sm:flex-row justify-center w-full sm:w-1/3 flex sm:justify-around items-center sm:visible', showLinks ? 'visible' : 'collapse')}>
                <div className={clsx('flex items-center justify-end w-1/2 transition-all', !searchRoutes.find((route) => route === pathname) && 'invisible')}>
                    <div className={'flex justify-center w-full sm:w-max sm:block'}>
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