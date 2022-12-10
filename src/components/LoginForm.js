import { useState } from 'react';
import {useAuth} from "../utils/useAuth";
import Input from "./Input";
import Loading from "./Loading";
import {Oval} from "react-loader-spinner";

const LoginForm = ({switchForms}) => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false)

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

        setLoading(!loading)

        login({
            email: form.email,
            password: form.password
        }).then((res) => setLoading(false))
    };

    return (
        <div className={'flex flex-col'}>
            <h2 className={'text-white text-3xl font-bold mb-8'}>Sign In</h2>
            <Input type={'email'} name={'email'} value={form.email} handleForm={handleForm} placeholder={'Email'}/>
            <Input type={"password"}  name={"password"} value={form.password} handleForm={handleForm} placeholder={"Password"}/>

            <button className={'flex transition-all justify-center items-center bg-red h-11 rounded mb-10 p-6 font-semibold text-white'} onClick={submitForm}>Sign In</button>
            <p style={styles}>{errorMessage}</p>
            <p className={'text-grey-1'}>New to Fakeflix? <b onClick={switchForms} className={'text-white hover:cursor-pointer'}>Sign up now.</b></p>
            {loading && <Oval
                height={80}
                width={80}
                color="#CC0000"
                secondaryColor={'#CC0000'}
                wrapperStyle={{}}
                wrapperClass="flex justify-center items-end h-full pt-10 mt-10"
                visible={true}
                ariaLabel='oval-loading'
                strokeWidth={2}
                strokeWidthSecondary={2}
            />}
        </div>
    );
};

export default LoginForm;