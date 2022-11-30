import LoginForm from "../components/LoginForm";
import {useContext} from "react";
import {AuthContext} from "../utils/AuthContext";

const Home = () => {
    const {message} = useContext(AuthContext)
    return (
        <>
            {message && <h1>{message}</h1>}
            <h1>Home</h1>
            <LoginForm />
        </>
    );
};

export default Home;