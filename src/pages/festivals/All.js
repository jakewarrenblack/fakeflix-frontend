import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import TitleCard from '../../components/TitleCard';
import {AuthContext} from "../../utils/AuthContext";
import {useAuth} from "../../utils/useAuth";
import Carousel from "../../components/Carousel";

const All = ({type}) => {
    const [ rows, setRows ] = useState([]);
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
                 let tempRows = response.data

                 const dividedRows = tempRows.reduce((tenPerRow, title, index) => {
                     const titleIndex = Math.floor(index/perRow)

                     if(!tenPerRow[titleIndex]) {
                         tenPerRow[titleIndex] = [] // start a new row from here
                     }

                     tenPerRow[titleIndex].push(title)

                    return tenPerRow
                 }, [])

                 // divide 50 titles into 5 rows of 10
                 // TODO: I need to only combine old and new values when dividedRows has CHANGED
                 // otherwise, we end up with 2 of the same row

                 // if previously set rows and our recently fetched rows are the same, just set the recent ones
                 // (user just visited this page)
                 if(rows?.length && rows === dividedRows){
                     console.log('prev rows and dividedRows are equal')
                     setRows(dividedRows)
                 }
                 // OR, if we have old rows and new rows which are different, keep the old ones and combine them with the new ones
                 // (user scrolling down page)
                 else if(rows?.length && rows !== dividedRows || !rows.length){
                     console.log('prev rows and dividedRows are NOT equal')
                     setRows([
                         ...rows,
                         ...dividedRows
                     ])
                 }




                 console.log('TITLES', rows)
             })
             .catch((err) => {
                 console.error(err);

                 // unauthorised
                 if(err.response.status === 401) logout()
             });

    }, [type, page]);




    if(rows.length === 0) return 'Loading...';

    // TODO: eventually these should also be divided by category? and have e.g. all comedies in one row
    // TODO: when user scrolls to bottom, use intersection observer or similar to load the next 50
    // our bottom page anchor is visible in the viewport, load the next 50

    console.log(rows)
    return (
        <>
            <h2>{type?.toUpperCase() ?? 'ALL LISTINGS'}</h2>

            {
                // Iterate over our 5 rows of 10
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
            }


            {/* Tie this button to the bottom of the page, temporary, to be replaced with intersection observer to call this method when bottom of page is reached*/}
            <button className={'bg-red text-white relative bottom-0'} onClick={() => setPage(page+1)}>Bottom of page anchor</button>
        </>
    );
};

export default All;