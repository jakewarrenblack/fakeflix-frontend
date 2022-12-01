import LoginForm from "../components/LoginForm";
import {useContext, useState} from "react";
import {AuthContext} from "../utils/AuthContext";
import RegisterForm from "../components/RegisterForm";


const Home = () => {
    const [form, switchForms] = useState('login')
    return (
        <>
        <div
            style={{background: 'url(/movies_bg.jpg) center'}}
            className={'h-full bg-cover fixed -z-0 brightness-50 w-full'}
        />
            <div className={'relative h-full w-full flex justify-center'}>
                <div className={'bg-black bg-opacity-75 px-16 py-20 min-w-[450px] rounded mt-32'}>
                    {/*<h1>Home</h1>*/}
                    {form == 'login' && <LoginForm switchForms={() => switchForms('register')} />}
                    {form == 'register' && <RegisterForm switchForms={() => switchForms('login')} />}
                </div>
            </div>
        </>
    );
};

export default Home;