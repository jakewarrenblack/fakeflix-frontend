import Input from "../../components/Input";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import Loading from "../../components/Loading";
import clsx from "clsx";
import Select from "../../components/Select";
import {AuthContext} from "../../utils/AuthContext";

const UpdateTitle = () => {
    const { id } = useParams();
    const [title, setTitle] = useState(null)
    const token = localStorage.getItem('token')

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
            })
            .catch((err) => {
                console.error(err);
            });
    }, [])

    const handleForm = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        console.log('value', value)
        console.log('name', name)

        setTitle(title => ({
            ...title,
            [name]: value
        }));

        console.log(title[name])
    };

    const submitForm = () => {

        axios
            .put(`http://localhost:3000/api/titles/update/${id}`, {
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

    if(!title) return <Loading/>

    // specific values need Select components
    // Particular care will be needed for arrays, which aren't real arrays, but strings formatted as:
    // "['item1', 'item2']"
    // Description should be replaced with a text area
    return <div className={'bg-grey-2 absolute w-full h-max min-h-full'}>
        <div className={'w-1/3 m-auto'}>
            <h1 className={'text-8xl text-white my-5'}>Edit Title</h1>
            <hr className={'mb-5'}/>
            {
                Object.keys(title)
                .map((key) => {
                    if(key == 'type'){
                        return <Select defaultValue={title[key]} name={key} displayName={key.toUpperCase()} handleForm={handleForm} values={[
                            {value: 'MOVIE', name: 'MOVIE'},
                            {value: 'SHOW', name: 'SHOW'},
                        ]}/>
                    }

                  return (
                      <div className={clsx(key == '_id' && '')}>
                        <Input defaultValue={title[key]} type={typeof(title[key])} name={key} id={key} handleForm={handleForm} labelValue={key.toUpperCase()}/>
                    </div>
                  )
                })
            }
        </div>
        <div className={'w-1/3 m-auto flex my-2 space-x-4'}>
            <button onClick={() => submitForm()} className={'px-8 hover:bg-white hover:text-black transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Save</button>
            <button className={'px-8 py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Cancel</button>
            <button className={'px-8 py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Delete</button>
        </div>
    </div>
}

export default UpdateTitle