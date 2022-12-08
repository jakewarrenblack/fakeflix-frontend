import Input from "../../components/Input";
import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import Loading from "../../components/Loading";

const UpdateTitle = () => {
    const { id } = useParams();
    const [title, setTitle] = useState(null)
    let mappingTitle;

    if(title){
        mappingTitle = Object.keys(title).map((k) => ({
            'key': k,
            'value': title[k],
            'type': typeof(title[k])
        }))
    }

    // First we populate the form fields with the existing title data
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}/titles/id/${id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                console.log(response.data);
                setTitle(response.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [])

    if(!title) return <Loading/>

    return <div className={'bg-grey-2 absolute w-full h-max min-h-full'}>
        <div className={'w-1/3 m-auto'}>
            {
                mappingTitle.map(({type, key, value}) => (
                     <div className={''}>
                        <Input value={value} type={type} name={key} id={key} labelValue={key.toUpperCase()}/>
                    </div>
                ))
            }
        </div>
    </div>
}

export default UpdateTitle