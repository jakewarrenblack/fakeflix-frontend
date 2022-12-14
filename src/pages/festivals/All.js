import axios from 'axios';
import {useState, useEffect, useContext, useRef} from 'react';
import TitleCard from '../../components/TitleCard';
import {AuthContext} from "../../utils/AuthContext";
import {useAuth} from "../../utils/useAuth";
import Carousel from "../../components/Carousel";
// I don't need the hook, just using this for a plain, single element, which is at the bottom of the viewport
import { InView } from 'react-intersection-observer';
import Loading from "../../components/Loading";
import HeroTitle from "../../components/HeroTitle";
import clsx from "clsx";
import {Oval} from "react-loader-spinner";

const All = ({type, results}) => {
    const [ rows, setRows ] = useState([]);
    // const {token} = useContext(AuthContext)
    const token = localStorage.getItem('token')
    const {logout} = useAuth()
    const [page, setPage] = useState(1)
    const perRow = 10 // 10 items per row
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(true)


    // Keeping a ref for what the last prop type was, I want to know if we were previously on shows, but now we're on movies, or vice-versa
    const usePrevious = (prop) => {
        const prev = useRef()
        useEffect(() => {
            prev.current = prop
        }, [prop])
        return prev.current
    }

    useEffect(() => {
        if(results){
            //setRows([])
            const dividedRows = results.reduce((tenPerRow, title, index) => {
                const titleIndex = Math.floor(index/perRow)

                if(!tenPerRow[titleIndex]) {
                    tenPerRow[titleIndex] = [] // start a new row from here
                }

                tenPerRow[titleIndex].push(title)

                return tenPerRow
            }, [])

            // results are definitely set to null when the search term is cleared, but are still included in dividedRows
            setSearchResults(dividedRows)
            setLoading(false)
        }
        else{
            setSearchResults([])
        }
    }, [results])

    const prevType = usePrevious(type)
    const typesChanged = type !== prevType

    useEffect(() => {
        console.log('main effect')
        // default limit is 30
        axios.get(type ? `${process.env.REACT_APP_URL}/titles/type/${type}?page=${page}` : `${process.env.REACT_APP_URL}/titles/all?limit=50`,
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
                    //console.log('prev rows and dividedRows are equal')
                    setRows(dividedRows)
                    setLoading(false)
                }
                    // OR, if we have old rows and new rows which are different, keep the old ones and combine them with the new ones
                // (user scrolling down page)
                else if(rows?.length && rows !== dividedRows || !rows.length){
                    //console.log('prev rows and dividedRows are NOT equal')
                    setRows([
                        ...rows,
                        ...dividedRows
                    ])
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.error(err);
                // unauthorised
                if(err.response.status === 401) logout()
            });

    }, [type, page]);

    if(rows.length === 0) return <Loading/>;

    // our bottom page anchor is visible in the viewport, load the next 50
    // just taking the first title to make a big hero title with, like netflix has
    const firstTitle = searchResults.length === 0 ? rows[0][0] : searchResults[0][0]

    if(loading) return <Loading loadingMsg='Loading titles'/>

    return (
        <div className={clsx('bg-grey-2 overflow-hidden pt-24 sm:pt-0', results && 'h-screen')}>
            <HeroTitle {...firstTitle} />
            <div className={'-mt-24 relative z-20 mx-2'}>
                {
                    // Iterate over our 5 rows of 10
                    searchResults.length === 0 ? rows.map((row) => {
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
                        : searchResults.map((row) => {
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
            {/* Don't show this if we're looking at set of search results, we don't paginate those */}
            {!loading && !results && <div className={'sticky w-full h-1 bottom-1 pt-[50px] flex justify-center items-center text-white'}>
                <InView onChange={(inView, entry) => {
                    // This check is necessary to prevent the observer from running on mount, immediately incrementing the pagination, and loading 100 results instead of 50
                    if (entry.intersectionRatio > 0) {
                        setPage(page+1)
                    }
                }
                }>
                    <span className={'absolute top-0 flex justify-center'}>Loading more titles
                        <Oval
                            height={20}
                            width={20}
                            color="#CC0000"
                            secondaryColor={'#CC0000'}
                            wrapperStyle={{}}
                            wrapperClass="ml-2"
                            visible={true}
                            ariaLabel='oval-loading'
                            strokeWidth={2}
                            strokeWidthSecondary={2}

                        />
                    </span>
                </InView>
            </div>}
        </div>
    );
};

export default All;