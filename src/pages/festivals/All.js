import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import TitleCard from '../../components/TitleCard';
import {AuthContext} from "../../utils/AuthContext";
import {useAuth} from "../../utils/useAuth";
import Carousel from "../../components/Carousel";

const All = ({type}) => {
    const [ titles, setTitles ] = useState(null);
    const {token} = useContext(AuthContext)
    const {logout} = useAuth()
    // Show first 30 titles to begin with, 10 per row
    // When user scrolls down we will eventually use intersection observer to increment this to another 30

    useEffect(() => {
        axios.get(type ? `${process.env.REACT_APP_URL}/titles/type/${type}?limit=30` : `${process.env.REACT_APP_URL}/titles/all?limit=500`,
            {
                    headers: {
                        Authorization : `Bearer ${token}`
                    }

                }
            )
             .then((response) => {
                 console.log(response.data);
                 setTitles(response.data);
             })
             .catch((err) => {
                 console.error(err);

                 // unauthorised
                 if(err.response.status == 401) logout()
             });
    }, [type]);


    if(!titles) return 'Loading...';

    // TODO: lets say get 30 at a time, 10 per row, need to split them up

    // TODO: eventually these should also be divided by category? and have e.g. all comedies in one row

    // TODO: when user scrolls to bottom, use intersection observer or similar to load the next 30

    const titleList = titles.map((title) => {
        return <div className={'m-5'}><TitleCard title={title} /></div>
    });
    return (
        <>
            <h2>{type?.toUpperCase() ?? 'ALL LISTINGS'}</h2>
            <div className={'relative w-100 overflow-hidden'}>
            <Carousel>
                { titleList }
            </Carousel>
            </div>


            {/* Tie this button to the bottom of the page, temporary, to be replaced with intersection observer to call this method when bottom of page is reached*/}
            {/*<button className={'bg-red text-white fixed bottom-0'}>More</button>*/}
        </>
    );
};

export default All;