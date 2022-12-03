import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import TitleCard from '../../components/TitleCard';
import {AuthContext} from "../../utils/AuthContext";
import {useAuth} from "../../utils/useAuth";
import Carousel from "../../components/Carousel";

const All = ({type}) => {
    const [ rows, setRows ] = useState(null);
    const {token} = useContext(AuthContext)
    const {logout} = useAuth()

    const [page, setPage] = useState(1)
    const perRow = 10 // 10 items per row

    useEffect(() => {
        // default limit is 30
        axios.get(type ? `${process.env.REACT_APP_URL}/titles/type/${type}?page=${page}` : `${process.env.REACT_APP_URL}/titles/all?limit=500`,
            {
                    headers: {
                        Authorization : `Bearer ${token}`
                    }
                }
            )
             .then((response) => {
                 let rows = response.data

                 // divide 30 titles into 3 rows of 10
                 setRows(rows.reduce((tenPerRow, title, index) => {
                     const titleIndex = Math.floor(index/perRow)

                     if(!tenPerRow[titleIndex]) {
                         tenPerRow[titleIndex] = [] // start a new row from here
                     }

                     tenPerRow[titleIndex].push(title)

                     return tenPerRow
                 }, []))



                 console.log('TITLES', setRows)
             })
             .catch((err) => {
                 console.error(err);

                 // unauthorised
                 if(err.response.status == 401) logout()
             });



    }, [type]);


    if(!rows) return 'Loading...';

    // TODO: eventually these should also be divided by category? and have e.g. all comedies in one row
    // TODO: when user scrolls to bottom, use intersection observer or similar to load the next 30

    // const titleList = titles.map((title) => {
    //     return <div className={'m-5'}><TitleCard title={title} /></div>
    // });

    return (
        <>
            <h2>{type?.toUpperCase() ?? 'ALL LISTINGS'}</h2>

            {
                // Iterate over our 3 rows of 10
                rows.map((row) => {
                    // Each row has a containing div, within which is a carousel
                    return <div className={'relative w-100 overflow-hidden'}>
                        <Carousel>
                        {
                            // Each carousel contains 10 cards
                            row.map((title) => {
                                return <div className={'m-5'}><TitleCard title={title} /></div>
                            })
                        }
                        </Carousel>
                    </div>
                })
            })


            {/* Tie this button to the bottom of the page, temporary, to be replaced with intersection observer to call this method when bottom of page is reached*/}
            {/*<button className={'bg-red text-white fixed bottom-0'} onSubmit={setPage(page+1)}>More</button>*/}
        </>
    );
};

export default All;