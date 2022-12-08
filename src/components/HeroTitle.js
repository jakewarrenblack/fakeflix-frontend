import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthContext} from "../utils/AuthContext";
import {getRelated} from "./TitleDialog";

const HeroTitle = (heroTitle) => {
    const [image, setImage] = useState()

    const {title, description, imdb_id, _id, age_certification, genres} = heroTitle
    const {token} = useContext(AuthContext)

    useEffect(() => {
        // https://logfetch.com/js-image-binary-jfif/
        axios.get(`https://img.omdbapi.com/?i=${imdb_id}&h=600&apikey=***REMOVED***`, {
            responseType: "blob"
        })
            .then((res) => {
                const url = URL.createObjectURL(res.data);
                setImage(url)

            }).catch((e) => {
            setImage(null)
            console.log('Image fetch error:', e)
        })
    }, [])

    return (
        <div className={'h-[70vh] pl-5 relative text-white flex flex-col justify-end overflow-hidden'} >
            <div className={'brightness-50 h-full filter blur-md min-h-[90%]'} style={{background: image ? `no-repeat center/cover url(${image})` : 'rgba(7,7,8, 1)'}}/>
            <div className={'mb-14 ml-5 w-3/4 absolute bottom-[20%]'}>
                <h1 className={'text-7xl'}>{title}</h1>
                <h4>{description}</h4>
                <button onClick={() => getRelated(genres, age_certification, _id, token)} className={'bg-white font-semibold rounded text-black px-5 py-2 mt-4'}>View</button>
            </div>
            <div className={'z-10 relative w-full h-full'} style={{background: '-webkit-linear-gradient(90deg, #141414, transparent 50%)'}}></div>
        </div>
    )
}

export default HeroTitle