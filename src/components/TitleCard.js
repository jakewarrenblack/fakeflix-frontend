import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios'
import {useContext, useEffect, useState} from "react";
import TitleDialog from "./TitleDialog";
import {AuthContext} from "../utils/AuthContext";
import clsx from "clsx";
import Portal from "./Portal";
import Toast from "./Toast";

const TitleCard = ({title, showRemover=false, setReload, type}) => {
    const [image, setImage] = useState(null)
    const {user} = useContext(AuthContext)
    const [toast, setToast] = useState()
    const {token} = useContext(AuthContext)

    const navigate = useNavigate()

    useEffect(() => {
        // Image is returned in JFIF format. https://logfetch.com/js-image-binary-jfif/
       axios.get(`https://img.omdbapi.com/?i=${title.imdb_id}&h=600&apikey=${process.env.REACT_APP_OMDB_KEY}`, {
           responseType: "blob"
       }).then((res) => {
            const url = URL.createObjectURL(res.data);
            setImage(url)
        }).catch((e) => {
            setImage(null)
           // not bothering to log, there will be a lot of errors as not all IMDB_IDs will have images.
           //console.log(e)
        })
    }, [title])

    const passTitle = {
        ...title,
        image,
    }

    const removeFromList = (_id, token) => {
        console.log('ID used by removeFromList', _id)
        return axios.post(`${process.env.REACT_APP_URL}/users/removeFromList`, {
                _id
            },
            {
                headers: {
                    Authorization : `Bearer ${token}`
                }
            }

        ).then((res) => {
            console.log('Response from removeFromList:', res)
            setReload(true)

            return res.data
        }).catch((e) => {
            console.log('Error from add to my list:', e)

        })
    }

    return (
        <>
        <div className={'h-[225px] group relative rounded z-0 flex flex-col justify-end bg-cover bg-no-repeat bg-center'} style={{background: image ? `no-repeat center/cover url(${image})` : 'rgba(7,7,8, 1)'}}>
            <div className={'z-10 absolute group-hover:opacity-0 transition-opacity w-full h-full'} style={{background: '-webkit-linear-gradient(90deg, rgb(24, 24, 24), transparent 50%)'}}></div>
            <div className={'flex relative z-20 space-x-4 items-center mb-4'}>
                <p className={'text-white ml-2 font-semibold text-lg'}>{title.title} ({title.type})</p>
               <TitleDialog {...passTitle}/>
                {showRemover && <button onClick={() => removeFromList(title._id, token).then((res) => {
                    if(res){
                        console.log('got response from removed from list')
                        setToast({
                            title: `${title.title} removed from favourites!`,
                        })
                    }
                })} className={'bg-grey-2 rounded-full h-[25px] w-[25px] border-grey-1 border-2 flex justify-center items-center'}>➖</button>}
                {
                    user?.database_admin && (
                        <div>
                            <button
                                onClick={() => navigate(`/updateTitle/${title._id}`)}
                                className={clsx("text-white bg-blue-700 px-2 py-1 rounded font-semibold")}>
                                Update
                            </button>
                        </div>
                    )
                }
           </div>
        </div>
            {toast && (
                <Portal>
                    {/* z-index 50 to make sure our toast is above the modal background overlay */}
                    <div className={'fixed right-5 bottom-5 z-50'}>
                        <Toast setParentState={setToast} title={toast.title}/>
                    </div>
                </Portal>
            )}
        </>
    );
};

export default TitleCard;