import axios from 'axios';
import {useState, useEffect, useContext} from 'react';
import TitleCard from '../../components/TitleCard';
import {AuthContext} from "../../utils/AuthContext";

const Index = () => {
    const [ titles, setTitles ] = useState(null);
    const {token} = useContext(AuthContext)

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}/titles/all`,
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
    }, []);


    if(!titles) return 'Loading...';

    const titleList = titles.map((title) => {
        return <TitleCard title={title} />;
    });

    return (
        <>
            <h2>Titles</h2>
            { titleList }
        </>
    );
};

export default Index;