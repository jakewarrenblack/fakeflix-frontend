import * as Dialog from '@radix-ui/react-dialog';
import {useEffect, useState, Suspense} from "react";
import axios from "axios";
import Loading from "./Loading";
import {Oval} from "react-loader-spinner";
import {useImage} from "react-image";
import clsx from "clsx";

const AvatarCard = ({img, name, setSelection, _id}) => {
    // Clicking any image will select it, closing the modal and passing the image's ID to the form
    const {src} = useImage({
        srcList: img
    })

    return (
        <div onClick={() => setSelection({img, _id})} className={{display: 'flex', marginTop: 25, justifyContent: 'flex-end'}}>
            <Dialog.Close asChild>
                <div className={'flex hover:cursor-pointer hover:brightness-100 brightness-75 justify-center flex-col items-center m-2]'}>
                    <img src={src} width={'90%'}/>
                    <h3 className={'font-semibold mt-2'}>{name?.toUpperCase()}</h3>
                </div>
            </Dialog.Close>
        </div>
    )
}

const ModalDialog = ({setSelection}) => {
    const [avatars, setAvatars] = useState([])
    const [loading, setLoading] = useState(true)
    // Fetch avatars
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}/avatars/all`).then((res) => {
            setAvatars(res.data)
            setLoading(false)
        }).catch((e) => {
            console.log(e)
            setLoading(false)
        })
    },[])

    if(avatars) {
        return (
            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <button className="text-white bg-red p-2 rounded font-semibold mb-2">
                        Choose an avatar
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal container={document.body}>
                    <Dialog.Overlay className="fixed w-screen h-screen bg-navBlack opacity-90 top-0 left-0"/>
                    <Dialog.Content className="text-white fixed w-screen top-1/3 p-5">
                        <Dialog.Title className={clsx("text-center text-4xl mb-10", loading && 'invisible')}>Avatars</Dialog.Title>
                        <div className={'flex flex-row justify-around'}>
                            {
                                !loading ?
                                avatars.map((avatar) => (
                                    <Suspense>
                                        <AvatarCard setSelection={setSelection} {...avatar}/>
                                    </Suspense>
                                )):
                                    <div className={'flex flex-col justify-center items-center'}>
                                        <h2 className={'text-white text-2xl mb-2'}>Loading avatars</h2>
                                        <Oval
                                            height={80}
                                            width={80}
                                            color="#CC0000"
                                            secondaryColor={'#CC0000'}
                                            wrapperStyle={{}}
                                            wrapperClass=""
                                            visible={true}
                                            ariaLabel='oval-loading'
                                            strokeWidth={2}
                                            strokeWidthSecondary={2}

                                        />
                                    </div>
                            }
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        )
    }
}

export default ModalDialog