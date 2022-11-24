import { useState } from 'react';
import axios from 'axios';
import {Navigate} from "react-router-dom";
import Navbar from "./Navbar";

const LoginForm = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    const [redirect, setRedirect] = useState(false)

    const styles = { color: "red", backgroundColor:"white" };

    const handleForm = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const submitForm = () => {
        console.log("Email: ", form.email);
        console.log("Password: ", form.password);

        axios.post(`${process.env.REACT_APP_URL}/api/users/login`, {
                email: form.email,
                password: form.password
            })
             .then((response) => {
                 console.log(response)
                console.log(response.data);
                 localStorage.setItem('token', response.data.token)
                setErrorMessage("");

                 setRedirect(true)


             })
             .catch((err) => {
                console.error(err);
                console.log(err.response.data);
                setErrorMessage(err.response.data.message);
             });
    };

    // if(authenticated) return "You are logged in";



    return (
        redirect ? <Navigate to={'/titles'}/> :
        <>
            Email: <input type="text" name="email" value={form.email} onChange={handleForm} />
            <br />
            Password: <input type="password" name="password" value={form.password} onChange={handleForm} />
            <button onClick={submitForm}>Submit</button>
            <p style={styles}>{errorMessage}</p>
        </>
    );
};

export default LoginForm;