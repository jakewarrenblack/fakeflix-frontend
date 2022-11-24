import { Link } from 'react-router-dom';

const TitleCard = ({title}) => {
    return (
        <div>
            <p><b>Title:</b> <Link to={`/titles/${title._id}`}>{title.title}</Link> </p>
            <p><b>Description:</b> {title.description}</p>
            <hr />
        </div>
    );
};

export default TitleCard;