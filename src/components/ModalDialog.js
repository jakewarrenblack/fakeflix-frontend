import * as Dialog from '@radix-ui/react-dialog';
import {useEffect, useState} from "react";
import axios from "axios";

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

const ModalDialog = ({setSelection}) => {
    const [avatars, setAvatars] = useState([])
    // Fetch avatars
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}/avatars/all`).then((res) => {
            console.log(res.data)
            setAvatars(res.data)
        }).catch((e) => console.log(e))
    },[])

    // Clicking any image will select it, closing the modal and passing the image's ID to the form

    if(!avatars) return '...'

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
                    <Dialog.Title className="text-center text-4xl mb-10">Avatars</Dialog.Title>

                    <div className={'flex flex-row justify-around'}>
                    {
                        avatars.map((avatar) => (
                            <AvatarCard setSelection={setSelection} {...avatar}/>
                        ))
                    }
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default ModalDialog