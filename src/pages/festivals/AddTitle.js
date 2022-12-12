import Input from "../../components/Input";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import clsx from "clsx";
import Select from "../../components/Select";
import handleForm from "../../utils/handleForm";
import {
    formatErrors,
    age_certification_values,
    getErrorMsg,
    arrayToDbFormat,
    age_cert_arr, genreOptions, productionCountryOptions
} from "../../utils/formHelpers";
import TextArea from "../../components/TextArea";
import MultiSelect from "../../components/MultiSelect";

const AddTitle = () => {
    document.title = 'ADD TITLE'

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

    const [errors, setErrors] = useState([])
    const [ageSelections, setAgeSelections] = useState([])
    const [productionCountries, setProductionCountries] = useState([])
    const [genres, setGenres] = useState([])

    const submitForm = () => {
        setErrors([])
        axios
            .post(`${process.env.REACT_APP_URL}/titles/create/`, {
                // Combine the user data with the stripe token, which is needed for checkout
                ...title,
            }, {
                headers: {
                    Authorization : `Bearer ${token}`
                }
            })
            .then(response => {
                console.log(response);
                alert("Add successful");
            })
            .catch(error => {
                console.log("Add error: ", error);
                setErrors(formatErrors(error.response.data.errors))
                alert("Edit failed");
            });
    };


    // All other types are enum or strings, just doing this so I can give a specific input type
    // note this isn't needed in the update title form, because we can infer the types from the existing data
    const formNumberTypes = [
        'release_year',
        'runtime',
        'seasons',
        'imdb_score',
        'imdb_votes',
        'tmdb_popularity',
        'tmdb_score'
    ]

    useEffect(() => {
        setTitle(title => ({
            ...title,
            production_countries: arrayToDbFormat(productionCountries),
            genres: arrayToDbFormat(genres),
            age_certification: arrayToDbFormat(ageSelections)
        }))
    }, [genres, productionCountries, ageSelections])

    return <div className={'bg-grey-2 absolute w-full h-max min-h-full'}>
        <div className={'w-1/3 m-auto'}>
            <h1 className={'text-8xl text-white my-5'}>Add Title</h1>
            <hr className={'mb-5'}/>
            <div className={'space-y-8'}>
            {
                Object.keys(title)
                    .map((key) => {
                        if(key == 'type'){
                            return <Select handleForm={(e) => handleForm(e, setTitle, title)} getErrorMsg={getErrorMsg} errors={errors} defaultValue={title[key]} name={key} displayName={key.toUpperCase()} values={[
                                {value: 'MOVIE', name: 'MOVIE'},
                                {value: 'SHOW', name: 'SHOW'},
                            ]}/>
                        }

                        if(key == 'age_certification'){
                            return <MultiSelect selections={ageSelections} setSelections={setAgeSelections} name={key} getErrorMsg={getErrorMsg} errors={errors} selectedValues={ageSelections} options={age_cert_arr}/>
                        }

                        if(key == 'genres'){
                            return <MultiSelect selections={genres} setSelections={setGenres} name={key} getErrorMsg={getErrorMsg} errors={errors} selectedValues={genres} options={genreOptions}/>
                        }

                        if(key == 'production_countries'){
                            return <MultiSelect selections={productionCountries} setSelections={setProductionCountries} name={key} getErrorMsg={getErrorMsg} errors={errors} selectedValues={productionCountries} options={productionCountryOptions}/>
                        }

                        if(key == 'description'){
                            return <div><TextArea handleForm={(e) => handleForm(e, setTitle, title)} defaultValue={title[key]} type={typeof(title[key])} name={key} id={key} getErrorMsg={getErrorMsg} errors={errors} labelValue={key.replaceAll('_', ' ').toUpperCase()}/></div>
                        }

                        return (
                            <div className={clsx((key == '_id' || key == 'updatedAt')  && 'hidden')}>
                                <Input disabled={title.type === 'MOVIE' && key === 'seasons'} handleForm={(e) => handleForm(e, setTitle, title)} defaultValue={title[key]} type={formNumberTypes.includes(key) ? 'number' : typeof(title[key])} name={key} id={key} getErrorMsg={getErrorMsg} errors={errors} labelValue={key.replaceAll('_', ' ').toUpperCase()}/>
                            </div>
                        )
                    })
            }
            </div>
        </div>
        <div className={'w-1/3 m-auto flex my-2 space-x-4'}>
            <button onClick={() => submitForm()} className={'px-8 hover:bg-white hover:text-black transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Save</button>
            <button onClick={() => navigate(-1)} className={'px-8 hover:bg-white hover:text-black transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Cancel</button>
        </div>

    </div>
}

export default AddTitle