import LoginForm from "../components/LoginForm";
import {useContext, useState} from "react";
import {AuthContext} from "../utils/AuthContext";
import RegisterForm from "../components/RegisterForm";
import {useLocation} from "react-router-dom";
import FlashMessage from "../components/FlashMessage";


const Home = () => {
    document.title = 'FakeFlix | Home'

    const [form, switchForms] = useState('login')

    const {token, user} = useContext(AuthContext)
    const {state} = useLocation()

    return (
        <>
            {state?.msg && <FlashMessage msg={state?.msg}/>}
            <div style={{background: 'url(/movies_bg.jpg) center'}}
                 className={'h-full bg-cover fixed -z-0 brightness-50 w-full'}/>

                <div className={'relative h-full w-full flex justify-center'}>
                    <div className={'bg-black bg-opacity-75 px-16 py-20 min-w-[450px] rounded mt-32'}>
                        {
                            !token?
                            <>
                                {form == 'login' && <LoginForm switchForms={() => switchForms('register')}/>}
                                {form == 'register' && <RegisterForm switchForms={() => switchForms('login')}/>}
                            </>
                                : <h1 className={'text-white text-center font-semibold text-2xl'}>Welcome {user?.email}</h1>
                        }
                    </div>
                </div>
        </>
    );
};

export default Home;