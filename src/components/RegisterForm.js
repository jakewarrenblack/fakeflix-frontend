import { useState } from 'react';
import {useAuth} from "../utils/useAuth";

const RegisterForm = ({switchForms}) => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    const {login} = useAuth()

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

        login({
            email: form.email,
            password: form.password
        })
    };


    return (
        <div className={'flex flex-col'}>
            <h2 className={'text-white text-3xl font-bold mb-8'}>Sign Up</h2>
            <input className={'bg-grey-3 h-11 rounded mb-4 p-6 font-semibold placeholder:text-grey-1 text-white'} type="email" placeholder="Email" name="email" value={form.email} onChange={handleForm} />
            <input className={'bg-grey-3 h-11 rounded mb-10 p-6 font-semibold placeholder:text-grey-1 text-white'} type="password" placeholder="Password" name="password" value={form.password} onChange={handleForm} />

            <button className={'flex justify-center items-center bg-red h-11 rounded mb-10 p-6 font-semibold text-white'} onClick={submitForm}>Sign In</button>
            <p style={styles}>{errorMessage}</p>
            <p className={'text-grey-1'}>New to Fakeflix? <b onClick={switchForms} className={'text-white'}>Sign up now.</b></p>
        </div>
    );
};

export default RegisterForm;