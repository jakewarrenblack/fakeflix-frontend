import {Link, useNavigate} from 'react-router-dom';
import clsx from "clsx";
import axios from 'axios'
import {useEffect, useState} from "react";
import TitleDialog from "./TitleDialog";

const TitleCard = ({title}) => {
    const [image, setImage] = useState(null)
    const navigate = useNavigate()

    useEffect(  () => {

                // Image is returned in JFIF format
                // https://logfetch.com/js-image-binary-jfif/
               axios.get(`https://img.omdbapi.com/?i=${title.imdb_id}&h=600&apikey=***REMOVED***`, {
                   responseType: "blob"
               })
                .then((res) => {
                    const url = URL.createObjectURL(res.data);
                    setImage(url)

        }).catch((e) => {
            setImage(null)
            //console.log(e)
        })

    }, [title])

    const passTitle = {
        ...title,
        image
    }

    return (
        // TODO: use Suspense here to lazy load images
        <div className={'h-[225px] group relative rounded z-0  hover:cursor-pointer flex flex-col justify-end bg-cover bg-no-repeat bg-center'} style={{background: image ? `no-repeat center/cover url(${image})` : 'rgba(7,7,8, 1)'}}>
            <div className={'z-10 absolute group-hover:opacity-0 transition-opacity w-full h-full'} style={{background: '-webkit-linear-gradient(90deg, rgb(24, 24, 24), transparent 50%)'}}></div>
            <div className={'flex relative z-20 space-x-4 items-center mb-4'}>
                <Link to={`/title/${title._id}`}><p className={'text-white ml-2 font-semibold text-lg'}>{title.title} ({title.type})</p></Link>

               <TitleDialog {...passTitle}/>
           </div>
        </div>
    );
};

export default TitleCard;