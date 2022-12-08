import Input from "../../components/Input";
import { useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import clsx from "clsx";
import Select from "../../components/Select";
import handleForm from "../../utils/handleForm";

const AddTitle = () => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const [title, setTitle] = useState({
        "id": "",
        "title": "",
        // Providing a default value
        "type": "MOVIE",
        "description": "",
        "release_year": null,
        "age_certification": null,
        "runtime": null,
        "genres": "",
        "production_countries": "",
        "seasons": null,
        "imdb_id": "",
        "imdb_score": null,
        "imdb_votes": null,
        "tmdb_popularity": null,
        "tmdb_score": null
    })

    const submitForm = () => {
        axios
            .post(`${process.env.REACT_APP_URL}/titles/create/`, {
                // Combine the user data with the stripe token, which is needed for checkout
                title,
            }, {
                headers: {
                    Authorization : `Bearer ${token}`
                }
            })
            .then(response => {
                console.log(response);
                alert("Edit successful");
            })
            .catch(error => {
                console.log("Edit error: ", error);
                alert("Edit failed");
            });
    };


    return <div className={'bg-grey-2 absolute w-full h-max min-h-full'}>
        <div className={'w-1/3 m-auto'}>
            <h1 className={'text-8xl text-white my-5'}>Add Title</h1>
            <hr className={'mb-5'}/>
            {
                Object.keys(title)
                    .map((key) => {
                        if(key == 'type'){
                            return <Select handleForm={(e) => handleForm(e, setTitle, title)} defaultValue={title[key]} name={key} displayName={key.toUpperCase()} values={[
                                {value: 'MOVIE', name: 'MOVIE'},
                                {value: 'SHOW', name: 'SHOW'},
                            ]}/>
                        }

                        return (
                            <div className={clsx((key == '_id' || key == 'updatedAt')  && 'hidden')}>
                                <Input handleForm={(e) => handleForm(e, setTitle, title)} defaultValue={title[key]} type={typeof(title[key])} name={key} id={key} labelValue={key.replaceAll('_', ' ').toUpperCase()}/>
                            </div>
                        )
                    })
            }
        </div>
        <div className={'w-1/3 m-auto flex my-2 space-x-4'}>
            <button onClick={() => submitForm()} className={'px-8 hover:bg-white hover:text-black transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Save</button>
            <button onClick={() => navigate(-1)} className={'px-8 hover:bg-white hover:text-black transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Cancel</button>
            <button className={'px-8 hover:bg-red hover:text-white transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Delete</button>
        </div>

    </div>
}

export default AddTitle