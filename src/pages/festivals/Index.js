import axios from 'axios';
import { useState, useEffect } from 'react';
import TitleCard from '../../components/TitleCard';

const Index = () => {
    const [ titles, setTitles ] = useState(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}/titles/all`,
            {
                    headers: {
                        Authorization : `Bearer ${localStorage.getItem("token")}`
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