import * as Dialog from '@radix-ui/react-dialog';
import {useEffect, useState} from "react";
import axios from "axios";
import clsx from "clsx";

// Maybe I could have used ModalDialog.js for both avatars and titles, but felt they'd be too different to bother
const AvatarCard = ({img, name, setSelection, _id}) => {
    return (
        <div onClick={() => setSelection({img, _id})} className={{display: 'flex', marginTop: 25, justifyContent: 'flex-end'}}>
            <Dialog.Close asChild>
                <div className={'flex hover:cursor-pointer hover:brightness-100 brightness-75 justify-center flex-col items-center m-2]'}>
                    <img src={img} width={'90%'}/>
                    <h3 className={'font-semibold mt-2'}>{name?.toUpperCase()}</h3>
                </div>
            </Dialog.Close>
        </div>


    )
}

const getStars = (number) => {
    const halfStar = 'https://img.icons8.com/ios-filled/100/star-half-empty.png'
    const star = 'https://img.icons8.com/ios-filled/100/star--v1.png'
    const emptyStar = 'https://img.icons8.com/ios/100/star--v1.png'
    let base, fraction;
    let stars = []

    // taking IMDB's 10 star system and representing it in terms of 5 stars
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


// TODO: In the case of a show, use the ?moreDetail query param to get extra info for the modal
const TitleDialog = ({title, image, genres, description, age_certification, seasons, runtime, imdb_score, tmdb_score, release_year, imdb_id}) => {
    let score = imdb_score ?? tmdb_score

    let stars = getStars(score).map((img) => {

        return <img className={'filter invert'} src={img} width={'25px'}/>
    })


    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="text-black bg-white px-2 py-1 rounded font-semibold">
                    View
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                    <Dialog.Overlay className="z-50 w-screen h-screen fixed bg-black/70 top-0 left-0 overflow-y-scroll grid place-items-center">
                        <Dialog.Content asChild className="rounded-lg text-white relative opacity-100 bg-grey-8 w-1/2 flex flex-col">
                            <div>
                                    <div id={'container'} className={'h-[500px] relative'}>
                                        <div className={' bg-blend-color brightness-50 rounded-lg  h-full'} style={{background: image ? `no-repeat center/cover url(${image})` : 'rgba(7,7,8, 1)'}}></div>

                                        {/* Has to be same height as bg image */}
                                        <div className={'left-0 disabled:opacity-50 space-y-4 top-0 h-full absolute flex flex-col justify-end align-start pb-10 w-full p-5'} style={{background: '-webkit-linear-gradient(90deg,#181818,transparent 50%)'}}>
                                            <Dialog.Title className="text-6xl mb-10">{title}</Dialog.Title>
                                            <main className={'space-y-4'}>
                                                <div className={'flex space-x-10'}>
                                                    <button onClick={() => window.open(`https://www.imdb.com/title/${imdb_id}/`, '_blank')}  disabled={!imdb_id || !imdb_id.length} className={'bg-white disabled:opacity-50 text-black rounded min-h-[42px] px-4 font-semibold text-2xl'}>
                                                        ▶
                                                        View on IMDB
                                                    </button>
                                                    <button className={'bg-grey-2 rounded-full h-[50px] w-[50px] border-grey-1 border-2'}>➕</button>
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

                                {/* Main content, plan to have recommended titles here */ }
                                <main className={'p-5 mt-14'}>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                </main>
                            </div>
                        </Dialog.Content>
                    </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default TitleDialog