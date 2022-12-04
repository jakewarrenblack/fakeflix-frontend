import * as Dialog from '@radix-ui/react-dialog';
import {useEffect, useState} from "react";
import axios from "axios";

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


// TODO: In the case of a show, use the ?moreDetail query param to get extra info for the modal
const TitleDialog = ({title, image, genres, description, age_certification, seasons, imdb_score, tmdb_score, release_year}) => {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button className="text-white bg-red p-2 rounded font-semibold mb-2">
                    View
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                    <Dialog.Overlay className="w-screen h-screen fixed bg-navBlack/50 top-0 left-0 overflow-y-scroll grid place-items-center">
                        <Dialog.Content asChild className="rounded-lg text-white relative top-[10%] opacity-100 bg-grey-8 w-1/2 flex flex-col">
                            <div>
                                    <div id={'container'} className={'h-[500px] relative'}>
                                        <div className={' bg-blend-color rounded-lg  h-full'} style={{background: image ? `no-repeat center/cover url(${image})` : 'rgba(7,7,8, 1)'}}></div>

                                        {/* Has to be same height as bg image */}
                                        <div className={'left-0 top-0 h-full absolute flex flex-col justify-end pb-10 w-full p-5'} style={{background: '-webkit-linear-gradient(90deg,#181818,transparent 50%)'}}>
                                            <Dialog.Title className="text-center text-4xl mb-10">{title}</Dialog.Title>

                                            <p className={''}>{description}</p>
                                        </div>
                                    </div>

                                {/* Main content, plan to have recommended titles here */ }
                                <main className={'p-5 mt-10'}>
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