import { Link } from 'react-router-dom';

const TitleCard = ({title, type}) => {
    return (
        <div>
            <p><b>Title:</b> <Link to={`/title/${title._id}`}>{title.title}</Link> </p>
            <p><b>Description:</b> {title.description}</p>
            <hr />
        </div>
    );
};

export default TitleCard;