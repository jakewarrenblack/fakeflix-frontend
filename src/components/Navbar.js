import { Link } from 'react-router-dom';

const Navbar = (props) => {
    return (
        <div>
            <Link to='/'>Home</Link> | 
            <Link to='/titles'>Titles</Link>
            {(props.authenticated) ? (
                <button>Logout</button>
            ) : ""}
        </div>
    );
};

export default Navbar;