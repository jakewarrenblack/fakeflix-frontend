import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import TitleCard from '../../components/TitleCard';

const Show = () => {
    const { id } = useParams();
    const [ title, setTitle] = useState(null);

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
                 console.log(err.response.data.message);                 
             });
    }, []);

    if(!title) return "Loading...";

    return (
        <TitleCard title={title} />
    );
};

export default Show;