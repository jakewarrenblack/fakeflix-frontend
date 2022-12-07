// Not loading a limited amount, just all favourites.
import axios from 'axios';
import {useState, useEffect, useContext, useRef} from 'react';
import TitleCard from '../../components/TitleCard';
import {AuthContext} from "../../utils/AuthContext";
import {useAuth} from "../../utils/useAuth";
import Loading from '../../components/Loading'
import Carousel from "../../components/Carousel";

const MyList = () => {
    console.log('my list component reached')
    const [ rows, setRows ] = useState([]);
    const {token, user} = useContext(AuthContext)
    const {logout} = useAuth()
    const perRow = 6
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        console.log('my list use effect running')
        axios.get(`http://localhost:3000/api/users/viewMyList`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).then((res) => {
            //setRows(res.data)
            let tempRows = res.data;

            const dividedRows = tempRows.reduce((sixPerRow, title, index) => {
                const titleIndex = Math.floor(index/perRow)

                if(!sixPerRow[titleIndex]) {
                    sixPerRow[titleIndex] = [] // start a new row from here
                }

                sixPerRow[titleIndex].push(title)

                return sixPerRow
            }, [])

            setRows(dividedRows)

            setLoading(false)
        }).catch((e) => {
            console.log(e)
            setLoading(false)
        })
    }, []);


    if(loading) return <Loading/>

    // TODO:: Style me
    if(!loading && !rows.length) return 'No favourites saved yet'



    return (
        <div className={'bg-grey-2 overflow-hidden h-screen pt-48'}>
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
                                        return <div className={'m-5 min-h-[225px]'}><TitleCard title={title} /></div>
                                    })
                                }
                            </Carousel>
                        </div>
                    })
                }
            </div>
        </div>
    );
};

export default MyList;