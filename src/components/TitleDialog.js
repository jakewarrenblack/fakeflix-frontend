import * as Dialog from '@radix-ui/react-dialog';
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useContext} from "react";
import {AuthContext} from "../utils/AuthContext";
import Toast from "./Toast";
import Portal from "./Portal";
import clsx from "clsx";
import loading from "./Loading";
import {Oval} from "react-loader-spinner";
import ModalVideo from 'react-modal-video-new'


const getStars = (number) => {
    const halfStar = 'https://img.icons8.com/ios-filled/100/star-half-empty.png'
    const star = 'https://img.icons8.com/ios-filled/100/star--v1.png'
    const emptyStar = 'https://img.icons8.com/ios/100/star--v1.png'
    let base, fraction;
    let stars = []


    // taking IMDB's 10-star system and representing it in terms of 5 stars
    number = number / 2

    if(number % 1 !== 0){ // it's a float, fix it
        let num = number.toFixed(1)
        base = num[0] // 1 is the dot
        fraction = num[2]

        for(let i = 0; i<base; i++){
            stars.push(star)
        }

        // half or more, add half a star
        if(fraction && fraction >= 5){
            stars.push(halfStar)
        }
    }
    else{
        for(let i = 0; i<number; i++){
            stars.push(star)
        }
    }

    // Populate the remainder with blank stars for clarity
    const remainingStars = 5 - stars.length

    for(let i = 0; i<remainingStars; i++){
        stars.push(emptyStar)
    }

    return stars;
}

const calcRunTime = (runTime) => {
    if(runTime > 60){
        const minutes = runTime % 60
        const hours = Math.ceil(runTime / 60)

        return `${hours}h ${minutes}m`
    }
    else{
        return `${runTime}m`
    }
}

const getRelated = (genres, age_certification, _id, token) => {
    return axios.post(`${process.env.REACT_APP_URL}/titles/getRelated`, {
        genres,
        _id,
        age_certification
    },
        {
            headers: {
                Authorization : `Bearer ${token}`
            }
        }

        ).then((res) => {
        console.log('RESPONSE FROM GET RELATED', res)

        return res.data
    }).catch((e) => {
        console.log('ERROR FROM GET RELATED', e)

    })
}

const addToMyList = (_id, token) => {
    console.log('ID used by addToMyList', _id)
    return axios.post(`${process.env.REACT_APP_URL}/users/addToMyList`, {
            _id
        },
        {
            headers: {
                Authorization : `Bearer ${token}`
            }
        }

    ).then((res) => {
        console.log('Response from add to my list:', res)



        return res.data
    }).catch((e) => {
        console.log('Error from add to my list:', e)

    })
}

const RelatedItem = ({token, relatedTitle, toast, setToast}) => {
    const {imdb_id, title, release_year, runtime, description, imdb_score, tmdb_score, age_certification, _id} = relatedTitle;
    const [stars, setStars] = useState(null)
    const [image, setImage] = useState(null)


    useEffect(() => {
        // get star rating and an image for every title
        let score = imdb_score ?? tmdb_score

        score && setStars(getStars(score).map((img) => {
            return <img className={'filter invert max-w-[25px] max-h-[25px]'} src={img}/>
        }))


        axios.get(`https://img.omdbapi.com/?i=${imdb_id}&h=600&apikey=***REMOVED***`, {
            responseType: "blob"
        })
            .then((res) => {
                const url = URL.createObjectURL(res.data);
                setImage(url)

            }).catch((e) => {
            setImage(null)
            // Not bothering to log this error, as so many titles won't have images. Not much I can do about this.
            //console.log('Image fetch error:', e)
        })

    },[])

    return (
        <>
        <div className="rounded mb-2 min-h-[22em] text-white relative opacity-100 bg-cardBg flex flex-col overflow-y-hidden">
            <div>
                <div id={'container'} className={'h-[500px] relative'}>
                    <div className={'h-1/2'}>
                        <div className={' bg-blend-color brightness-50 rounded rounded-b-none  h-full'} style={{background: image ? `no-repeat center/cover url(${image})` : 'rgba(7,7,8, 1)'}}></div>
                        {/* Position title above background image */}
                        <Dialog.Title className="text-3xl w-full px-5 relative bottom-1/3">{title}</Dialog.Title>
                    </div>
                    <main className={'space-y-3 h-1/2 p-5 flex flex-col'}>
                        <div className={'flex space-x-5 items-center'}>
                            <button onClick={() => window.open(`https://www.imdb.com/title/${imdb_id}/`, '_blank')}  disabled={!imdb_id || !imdb_id.length} className={'bg-white disabled:opacity-50 text-black rounded min-h-[42px] px-4 font-semibold text-lg'}>
                                ▶
                                View on IMDB
                            </button>
                            <button
                                onClick={() => addToMyList(_id, token).then((res) => {
                                    if(res){
                                        console.log('got response from add to my list')
                                        setToast({
                                            title: `${title} added to favourites!`,
                                            description: "Visit 'my list' to view your favourites."
                                        })
                                    }
                                })}
                                className={'bg-grey-2 transition-all rounded-full h-[30px] w-[30px] border-grey-1 border-2 text-center flex justify-center items-center hover:text-green-500 hover:invert hover:bg-[#ff99f9]'}>
                                ➕
                            </button>
                        </div>

                        <div className={'flex space-x-5 font-semibold'}>
                            <span className={'text-green-500 flex'}>{stars ?? 'No rating.'}</span>
                            <span className={'px-1 border border-grey-1 h-min'}>{age_certification.length ? age_certification : '?'}</span>
                            <span>{release_year}</span>
                            <span>{runtime && calcRunTime(runtime)}</span>
                        </div>

                        <div className={'overflow-hidden text-clip'}>
                            <p>{description}</p>
                        </div>
                    </main>
                </div>
            </div>
        </div>

        </>
    )
}



// TODO: In the case of a show, use the ?moreDetail query param to get extra info for the modal
const TitleDialog = ({_id, title, image, genres, description, age_certification, seasons, runtime, imdb_score, tmdb_score, release_year, imdb_id, variant}) => {
    let score = imdb_score ?? tmdb_score


    let stars = getStars(score).map((img) => {
        return <img className={'filter invert'} src={img} width={'25px'}/>
    })

    const {token} = useContext(AuthContext)
    const [related, setRelated] = useState([])
    const [toast, setToast] = useState(null)
    const [loadingRelated, setLoadingRelated] = useState(true)
    const [isOpen, setOpen] = useState(false)
    const [trailer, setTrailer] = useState(null)
    const playerRef = useRef(null);

    const getTrailer = (imdb_id) => {
        setTrailer(null)
        if (imdb_id) {
            console.log('running trailer effect')
            axios.get(`***REMOVED***/3/movie/${imdb_id}/videos?api_key=***REMOVED***&external_source=imdb_id`).then((res) => {
                console.log(res)
                if (res?.data?.results[0]) {
                    console.log(res.data)
                    setTrailer(res.data.results[0])
                }


            }).catch((e) => {
                console.log(e)
                setTrailer(null)
            })

        }
    }

    return (
        <>
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button
                    onClick={() => getRelated(genres, age_certification, _id, token).then((res => {
                        // first job is to get a trailer, if available
                        getTrailer(imdb_id)

                        setRelated(res.result)
                        console.log('SETTING RES STATE', res.result)
                        setLoadingRelated(false)
                    })).catch((e) => {
                        setRelated([])
                        setLoadingRelated(false)
                    })
                } className={clsx("text-black bg-white px-2 py-1 rounded font-semibold", variant == 'lg' && 'text-3xl px-5 py-2')}>
                    View
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="z-50 w-screen h-screen fixed bg-black/70 top-0 left-0 overflow-y-scroll grid place-items-center">
                    <Dialog.Content asChild className="rounded-lg text-white relative opacity-100 bg-grey-8 w-3/4 flex flex-col">
                        <div>
                            <div id={'container'} className={clsx('h-[500px] relative', trailer?.key && 'flex justify-center items-center')}>
                                {
                                    !trailer?.key ?
                                    <div className={'bg-blend-color brightness-50 rounded-lg z-[99] h-full'} style={{background: image ? `no-repeat center/cover url(${image})` : 'rgba(7,7,8, 1)'}}></div>
                                    :
                                        <>
                                            <button className={clsx("hover:cursor-pointer text-white text-8xl z-[100000] transition-all", isOpen && 'opacity-0')} onClick={()=> setOpen(true)}>▶</button>

                                        <div id={'video-container'} className={'bg-blend-color brightness-[25%] rounded-lg h-full absolute w-full'} style={{background: image ? `no-repeat center/cover url(${image})` : 'rgba(7,7,8, 1)'}}>

                                            <Portal container={'#container'}>
                                            <ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId={trailer.key} onClose={() => setOpen(false)} />
                                            </Portal>
                                        </div>
                                        </>
                                }

                                {/* Has to be same height as bg image */}
                                <div className={'left-0 disabled:opacity-50 space-y-4 top-0 h-full z-[10000] absolute flex flex-col justify-end align-start pb-10 w-full p-5'} style={{background: '-webkit-linear-gradient(90deg,#181818,transparent 50%)'}}>
                                    <Dialog.Title className="text-6xl mb-10">{title}</Dialog.Title>
                                    <main className={'space-y-4'}>
                                        <div className={'flex space-x-10'}>
                                            <button onClick={() => window.open(`https://www.imdb.com/title/${imdb_id}/`, '_blank')}  disabled={!imdb_id || !imdb_id.length} className={'bg-white disabled:opacity-50 text-black rounded min-h-[42px] px-4 font-semibold text-2xl'}>
                                                ▶
                                                View on IMDB
                                            </button>
                                            <button onClick={() => {
                                                console.log('watch trailer click')
                                                if(imdb_id){
                                                    trailer(imdb_id)
                                                }

                                            }}>Watch Trailer</button>
                                            <button onClick={() => addToMyList(_id, token).then((res) => {
                                                if(res){
                                                    console.log('got response from add to my list')
                                                    setToast({
                                                        title: `${title} added to favourites!`,
                                                        description: "Visit 'my list' to view your favourites."
                                                    })
                                                }
                                            })}className={'bg-grey-2 rounded-full h-[50px] w-[50px] border-grey-1 border-2 hover:text-green-500 hover:invert hover:bg-[#ff99f9]'}>➕</button>
                                        </div>

                                        <div className={'flex space-x-10 font-semibold'}>
                                            <span className={'text-green-500 flex'}>{stars}</span>
                                            <span className={'px-1 border border-grey-1'}>{age_certification}</span>
                                            <span>{release_year}</span>
                                            <span>{runtime && calcRunTime(runtime)}</span>
                                        </div>

                                        <p className={'relative top-[10%]'}>{description}</p>
                                    </main>
                                </div>
                            </div>
                            <main className={'p-5 mt-14'}>
                                {/* TODO: Add loader for recommended */ }
                                {
                                    !loadingRelated && related.length > 0 ? (
                                        <>
                                            <h3 className={'text-4xl text-center font-semibold my-4 mb-6'}>You may also like</h3>
                                            <div className={'grid grid-cols-3 gap-2'}>
                                                {
                                                    related.map((relatedTitle) => {
                                                        return <RelatedItem token={token} toast={toast} setToast={setToast} relatedTitle={relatedTitle}/>
                                                    })
                                                }
                                            </div>
                                        </>
                                    ) : loadingRelated ?
                                        <div>
                                            <h2 className={'text-white text-2xl font-semibold text-center'}>Searching for related titles...</h2>
                                            <Oval
                                            height={80}
                                            width={80}
                                            color="#CC0000"
                                            secondaryColor={'#CC0000'}
                                            wrapperStyle={{}}
                                            wrapperClass="m-auto justify-center"
                                            visible={true}
                                            ariaLabel='oval-loading'
                                            strokeWidth={2}
                                            strokeWidthSecondary={2}/>
                                        </div> : !loadingRelated && (
                                        // If no longer loading but there are still no related titles, we just haven't found any for this title.
                                        <>
                                            <h3 className={'text-4xl text-center font-semibold my-4 mb-6'}>No related titles found</h3>
                                        </>
                                    )
                                }
                            </main>
                        </div>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
            {toast && (
                <Portal>
                    {/* z-index 50 to make sure our toast is above the modal background overlay */}
                    <div className={'fixed right-5 bottom-5 z-50'}>
                        <Toast setParentState={setToast} title={toast.title} description={toast.description}/>
                    </div>
                </Portal>
            )}
        </>
    )
}

export default TitleDialog