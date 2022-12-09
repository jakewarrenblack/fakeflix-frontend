import {useEffect, useState} from "react";
import axios from "axios";
import TitleDialog from "./TitleDialog";

const HeroTitle = (heroTitle) => {
    console.log('hero title', heroTitle)
    const [image, setImage] = useState(null)
    const {imdb_id, title, description} = heroTitle

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
    }, [title])

    const passTitle = {
        ...heroTitle,
        image,
        variant: 'lg'
    }

    return (
        <div className={'h-[70vh] pl-5 relative text-white flex flex-col justify-end overflow-hidden'} >
            <div className={'brightness-50 h-full filter blur-md min-h-[90%]'} style={{background: image ? `no-repeat center/cover url(${image})` : 'rgba(7,7,8, 1)'}}/>
            <div className={'mb-14 ml-5 w-3/4 absolute bottom-[20%]'}>
                <h1 className={'text-7xl'}>{title}</h1>
                <h4>{description}</h4>
                <div className={'mt-5'}>
                    <TitleDialog {...passTitle} variant={'lg'}/>
                </div>
                <div className={'z-10 relative w-full h-full'} style={{background: '-webkit-linear-gradient(90deg, #141414, transparent 50%)'}}></div>
            </div>
        </div>
    )
}

export default HeroTitle