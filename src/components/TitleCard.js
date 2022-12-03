import { Link } from 'react-router-dom';
import clsx from "clsx";
import axios from 'axios'
import {useEffect, useState} from "react";

const TitleCard = ({title, url}) => {
    const [image, setImage] = useState(null)

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

    return (
        <div className={'h-[225px] flex flex-col justify-end bg-cover bg-no-repeat bg-center'} style={{background: image ? `no-repeat center/cover url(${image})` : 'rgba(7,7,8, 1)'}}>
            <p className={'text-white mb-2 ml-2 font-semibold text-lg'}><Link to={`/title/${title._id}`}>{title.title}</Link> </p>
        </div>
    );
};

export default TitleCard;