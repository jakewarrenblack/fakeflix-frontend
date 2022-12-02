import { useState } from 'react';
import {useAuth} from "../utils/useAuth";
import Input from "./Input";
import Select from "./Select";
import StripeForm from "./StripeForm";
import StripeCheckout from "react-stripe-checkout";

const RegisterForm = ({switchForms}) => {
    const [form, setForm] = useState(	{
        "firstName": "",
        "lastName": "",
        "username": '',
        "email": '',
        "password": '',
        "type": "admin",
        "database_admin": false,
        // Hardcode for now, I'll have to pull these in to select one on registration
        "avatar": "d3c74ece8c741e0b2bfbbabe",
        "language": "EN",
        "maturity_setting": 'unrestricted',
        "autoplay_enabled": true,
        "subscription": 'Movies & Shows',
        // Empty list allowed, doesn't make sense to have values yet.
        "my_list": [

        ],
        "pin": null
    });
    const [errorMessage, setErrorMessage] = useState("");

    const {register} = useAuth()

    const styles = { color: "red", backgroundColor:"white" };

    const handleForm = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        console.log(e)

        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const submitForm = () => {
        console.log("Email: ", form.email);
        console.log("Password: ", form.password);

        register(form)
    };

    const [formIndex, setFormIndex] = useState(1)



    return (
        <div className={'flex flex-col'}>
            <h2 className={'text-white text-3xl font-bold mb-8'}>Sign Up</h2>

            <div className={'flex'}>
                <div className={'mr-2'}>
                    <Input type={'text'} name={'firstName'} value={form.firstName} handleForm={handleForm} placeholder={'First name'}/>
                </div>
                <Input type={'text'} name={'lastName'} value={form.lastName} handleForm={handleForm} placeholder={'Last name'}/>
            </div>

            <div className={'flex'}>
                <div className={'mr-2'}>
                    <Input type={'text'} name={'username'} value={form.username} handleForm={handleForm} placeholder={'Username'}/>
                </div>
                <Input type={'email'} name={'email'} value={form.email} handleForm={handleForm} placeholder={'Email'}/>
            </div>

            <Input type={'password'} name={'password'} value={form.password} handleForm={handleForm} placeholder={'Password'}/>

            <Input type={'text'} name={'pin'} value={form.pin} handleForm={handleForm} placeholder={'Pin'}/>

            {/* String for now, we will be able to see avatars and select one */}
            <Input disabled={true} type={'text'} name={'avatar'} value={form.avatar} handleForm={handleForm} placeholder={'Avatar'}/>

            <Select value={form.type} name={'type'} displayName={'User Type'} handleForm={handleForm} values={[
                {value: 'admin', name: 'Admin'},
                {value: 'user', name: 'Sub User'},
                {value: 'child', name: 'Child'}
            ]}/>

            <Select value={form.language} name={'language'} displayName={'Language'} handleForm={handleForm} values={[
                {value: 'EN', name: 'EN'},
                {value: 'DE', name: 'DE'},
                {value: 'FR', name: 'FR'}
            ]}/>

            <Select value={form.maturity_setting} name={'maturity_setting'} displayName={'Maturity Setting'} handleForm={handleForm} values={[
                {value: 'unrestricted', name: 'Unrestricted (18+)'},
                {value: 'semi-restricted', name: 'Semi-Restricted'},
                {value: 'restricted', name: 'Restricted (Default if child)'}
            ]}/>

            <Select value={form.subscription} name={'subscription'} displayName={'Subscription'} handleForm={handleForm} values={[
                {value: 'Movies & Shows', name: 'Movies & Shows'},
                {value: 'Shows', name: 'Shows'},
                {value: 'Movies', name: 'Movies'}
            ]}/>

            <div className={'flex justify-between w-3/4 mb-4'}>
                <div className={'mb-4'}>
                    <label className={'text-white'} htmlFor="autoplay_enabled">Autoplay Enabled </label>
                    <input type="checkbox" name="autoplay_enabled" onChange={handleForm} value="false"/>
                </div>

                <div className={'mb-4'}>
                    <label className={'text-white'} htmlFor="database_admin">Database admin </label>
                    <input disabled type="checkbox" onChange={handleForm} name="database_admin" value="false"/>
                </div>
            </div>

            {/*<button className={'flex justify-center items-center bg-red h-11 rounded mb-10 p-6 font-semibold text-white'} onClick={submitForm}>Sign Up</button>*/}
            {/*<button className={'flex justify-center items-center bg-red h-11 rounded mb-10 p-6 font-semibold text-white'} onClick={() => setFormIndex(formIndex+1)}>Continue to Payment</button>*/}

            {/* Register and payment are now the same in the backend, pass user data to stripe form */}
            <StripeForm {...form} />
            <p style={styles}>{errorMessage}</p>

            <p className={'text-grey-1'}>Existing user? <b onClick={switchForms} className={'text-white hover:cursor-pointer'}>Sign in.</b></p>
        </div>

    );
};

export default RegisterForm;