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
        <div className={'w-[400px] h-[200px] m-2 flex flex-col justify-center'} style={{background: image ? `url(${image})` : 'rgba(217,217,217, 1)'}}>
            <p className={'text-white'}><b>Title:</b> <Link to={`/title/${title._id}`}>{title.title}</Link> </p>
            {/*<p><b>Description:</b> {title.description}</p>*/}
            <hr />
        </div>
    );
};

export default TitleCard;