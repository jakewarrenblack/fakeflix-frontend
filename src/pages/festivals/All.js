import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import TitleCard from '../../components/TitleCard';
import {AuthContext} from "../../utils/AuthContext";
import {useAuth} from "../../utils/useAuth";

const All = ({type}) => {
    const [ titles, setTitles ] = useState(null);
    const {token} = useContext(AuthContext)
    const {logout} = useAuth()
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

                 // unauthorised
                 if(err.response.status == 401) logout()
             });
    }, [type]);


    if(!titles) return 'Loading...';

    const titleList = titles.map((title) => {
        return <div className={'inline-block'}><TitleCard title={title} /></div>
    });
    return (
        <>
            <h2>{type?.toUpperCase() ?? 'ALL LISTINGS'}</h2>
            <div className={'relative w-100 whitespace-nowrap overflow-x-scroll overflow-y-visible'}>
            { titleList }
            </div>
        </>
    );
};

export default All;