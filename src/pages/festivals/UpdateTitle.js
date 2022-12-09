import Input from "../../components/Input";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import Loading from "../../components/Loading";
import clsx from "clsx";
import Select from "../../components/Select";
import handleForm from "../../utils/handleForm";
import {getErrorMsg, arrayFromString,arrayToDbFormat, age_cert_arr, genreOptions, productionCountryOptions} from "../../utils/formHelpers";
import MultiSelect from "../../components/MultiSelect";

const UpdateTitle = () => {
    const { id } = useParams();
    const [title, setTitle] = useState(null)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const [errors, setErrors] = useState([])

    const [ageSelections, setAgeSelections] = useState([])
    const [productionCountries, setProductionCountries] = useState([])
    const [genres, setGenres] = useState([])

    // First we populate the form fields with the existing title data
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}/titles/id/${id}`, {
            headers: {
                Authorization : `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log(response.data);
                setTitle(response.data)

                setAgeSelections(arrayFromString(response.data.age_certification))
                setGenres(arrayFromString(response.data.genres))
                setProductionCountries(arrayFromString(response.data.production_countries))
            })
            .catch((err) => {
                console.error(err);
            });
    }, [])


    const submitForm = () => {
        axios
            .put(`${process.env.REACT_APP_URL}/titles/update/${id}`, {
                // Combine the user data with the stripe token, which is needed for checkout
                ...title,
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

    // multiselect values are held in their own state, sync state with title object
    useEffect(() => {
        setTitle(title => ({
            ...title,
            production_countries: arrayToDbFormat(productionCountries),
            genres: arrayToDbFormat(genres),
            age_certification: arrayToDbFormat(ageSelections)
        }))
    }, [genres, productionCountries, ageSelections])

    if(!title) return <Loading/>

    // specific values need Select components
    // Particular care will be needed for arrays, which aren't real arrays, but strings formatted as:
    // "['item1', 'item2']"
    // Description should be replaced with a text area
    return <div className={'bg-grey-2 absolute w-full h-max min-h-full'}>
        <div className={'w-1/3 m-auto'}>
            <h1 className={'text-8xl text-white my-5'}>Edit Title</h1>
            <hr className={'mb-5'}/>
            <div className={'space-y-8'}>
            {
                Object.keys(title)
                .map((key) => {
                    if(key == 'type'){
                        return <Select getErrorMsg={getErrorMsg} errors={errors} defaultValue={title[key]} name={key} displayName={key.toUpperCase()} handleForm={(e) => handleForm(e, setTitle, title)} values={[
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

                  return (
                      <div className={clsx((key == '_id' || key == 'updatedAt')  && 'hidden')}>
                        <Input disabled={title.type === 'MOVIE' && key === 'seasons'} getErrorMsg={getErrorMsg} errors={errors} defaultValue={title[key]} type={typeof(title[key])} name={key} id={key} handleForm={(e) => handleForm(e, setTitle, title)} labelValue={key.replaceAll('_', ' ').toUpperCase()}/>
                    </div>
                  )
                })
            }
            </div>
        </div>
        <div className={'w-1/3 m-auto flex my-2 space-x-4'}>
            <button onClick={() => submitForm()} className={'px-8 hover:bg-white hover:text-black transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Save</button>
            <button onClick={() => navigate(-1)} className={'px-8 hover:bg-white hover:text-black transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Cancel</button>
            <button className={'px-8 hover:bg-red hover:text-white transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Delete</button>
        </div>

    </div>
}

export default UpdateTitle