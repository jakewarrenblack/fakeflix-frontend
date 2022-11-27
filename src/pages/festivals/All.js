import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import TitleCard from '../../components/TitleCard';
import {AuthContext} from "../../utils/AuthContext";

const All = ({type}) => {
    const [ titles, setTitles ] = useState(null);
    const {token} = useContext(AuthContext)

    useEffect(() => {
        axios.get(type ? `${process.env.REACT_APP_URL}/titles/type/${type}?limit=10` : `${process.env.REACT_APP_URL}/titles/all?limit=500`,
            {
                    headers: {
                        Authorization : `Bearer ${token}`
                    }

                }
            )
             .then((response) => {
                 console.log(response.data);
                 setTitles(response.data);
             })
             .catch((err) => {
                 console.error(err);
             });
    }, [type]);


    if(!titles) return 'Loading...';

    const titleList = titles.map((title) => {
        return <TitleCard title={title} />;
    });

    return (
        <>
            <h2>{type?.toUpperCase() ?? 'ALL LISTINGS'}</h2>
            { titleList }
        </>
    );
};

export default All;