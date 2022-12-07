// Following the netflix layout, this page doesn't use carousels. Just rows of cards.
// Also, not loading a limited amount, just all favourites.

import axios from 'axios';
import {useState, useEffect, useContext, useRef} from 'react';
import TitleCard from '../../components/TitleCard';
import {AuthContext} from "../../utils/AuthContext";
import {useAuth} from "../../utils/useAuth";

const MyList = () => {
    const [ rows, setRows ] = useState([]);
    const {token, user} = useContext(AuthContext)
    const {logout} = useAuth()

    const [page, setPage] = useState(1)
    const perRow = 10 // 10 items per row


    useEffect(() => {
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

                // if previously set rows and our recently fetched rows are the same, just set the recent ones
                // (user just visited this page)
                // if types changed, we also just reset. e.g. if we swapped from movies to shows, discard the existing movies and reload all from scratch.
                if(rows?.length && rows === dividedRows || typesChanged){
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

    // our bottom page anchor is visible in the viewport, load the next 50
    // just taking the first title to make a big hero title with, like netflix has
    const firstTitle = rows[0][0]

    const HeroTitle = ({title, desc, imdb_id}) => {
        const [image, setImage] = useState()

        useEffect(() => {
            // https://logfetch.com/js-image-binary-jfif/
            axios.get(`https://img.omdbapi.com/?i=${imdb_id}&h=600&apikey=***REMOVED***`, {
                responseType: "blob"
            })
                .then((res) => {
                    const url = URL.createObjectURL(res.data);
                    setImage(url)

                }).catch((e) => {
                setImage(null)
                console.log('Image fetch error:', e)
            })
        }, [])

        return (
            <div className={'h-[70vh] pl-5 relative text-white flex flex-col justify-end overflow-hidden'} >
                <div className={'brightness-50 h-full filter blur-md min-h-[90%]'} style={{background: image ? `no-repeat center/cover url(${image})` : 'rgba(7,7,8, 1)'}}/>
                <div className={'mb-14 ml-5 w-3/4 absolute bottom-[20%]'}>
                    <h1 className={'text-7xl'}>{title}</h1>
                    <h4>{desc}</h4>
                    <button className={'bg-white font-semibold rounded text-black px-5 py-2 mt-4'}>View</button>
                </div>
                <div className={'z-10 relative w-full h-full'} style={{background: '-webkit-linear-gradient(90deg, #141414, transparent 50%)'}}></div>
            </div>
        )
    }

    return (
        <div className={'bg-grey-2 overflow-hidden'}>
            <HeroTitle title={firstTitle.title} desc={firstTitle.description} imdb_id={firstTitle.imdb_id}/>
            <div className={'-mt-24 relative z-20'}>
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
            </div>

            {/* Keep me at the bottom of the viewport. When a user reaches the bottom of the page, increase the pagination to load the next 50 titles.*/}
            <div className={'relative w-1 h-1 bottom-1'}>
                <InView onChange={() => setPage(page+1)}/>
            </div>
        </div>
    );
};

export default All;