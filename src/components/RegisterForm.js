import {useEffect, useRef, useState} from 'react';
import Input from "./Input";
import Select from "./Select";
import StripeForm from "./StripeForm";
import ModalDialog from "./ModalDialog";
import axios from "axios";
import clsx from "clsx";
import {Oval} from "react-loader-spinner";
import {getErrorMsg} from "../utils/formHelpers";

const RegisterForm = ({switchForms}) => {
    const [selectedAvatar, setSelectedAvatar] = useState({})
    const [adminFieldVisible, setAdminFieldVisible] = useState(false)
    const [adminId, setAdminId] = useState()
    const [adminMessage, setAdminMessage] = useState('')
    const [isDbAdmin, setIsDbAdmin] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState([])

    const adminInput = useRef()

    const [form, setForm] = useState(	{
        "firstName": "",
        "lastName": "",
        "username": '',
        "email": '',
        "password": '',
        "type": "admin",
        "database_admin": false,
        // Just providing a default avatar.
        "avatar": 'd3c74ece8c741e0b2bfbbabe',
        "language": "EN",
        "maturity_setting": 'unrestricted',
        "autoplay_enabled": true,
        "subscription": 'Movies & Shows',
        // Empty list allowed, doesn't make sense to have values yet.
        "my_list": [],
        // Only sub-users and child accounts need an admin ID, admins don't need to provide an admin ID
        "admin": null,
        "pin": null
    });

    const [errorMessage, setErrorMessage] = useState("");

    // Controlled by the avatars modal
    useEffect(() => {
        setForm(form => ({
            ...form,
            avatar: selectedAvatar._id
        }))
    }, [selectedAvatar])

    useEffect(() => {
        setForm(form => ({
            ...form,
            database_admin: isDbAdmin
        }))
    }, [isDbAdmin])


    // Controlled by the 'verify admin' input field, which appears when 'type' is not 'admin'
    useEffect(() => {
        setForm(form => ({
            ...form,
            admin: adminId
        }))
    }, [adminId])

    const styles = { color: "red", backgroundColor:"white" };

    const handleForm = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        console.log(e)

        // If user has selected a type other than admin, reveal the 'admin id' field, as they need to provide this
        if(name === 'type'){
            setAdminFieldVisible(!adminFieldVisible)
        }

        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const verifyAdminEmail = (email) => {
        setAdminMessage('')
        email = email?.value

        axios.post(`${process.env.REACT_APP_URL}/users/verifyAdmin`, {
            email
        }).then((res) => {
            setAdminId(res.data.id)
            setAdminMessage(res.data.msg)
        }).catch((e) => {
            console.log(e)
            setAdminMessage(e.response.data.msg)
        })
    }

    return (
        <div className={'flex flex-col max-w-[450px]'}>
            <h2 className={'text-white text-3xl font-bold mb-8'}>Sign Up</h2>

            <div className={'flex space-x-4'}>
                <div className={'w-1/2'}>
                    <Input type={'text'} getErrorMsg={getErrorMsg} errors={errors} name={'firstName'} value={form.firstName} handleForm={handleForm} placeholder={'First name'}/>
                </div>
                <div className={'w-1/2'}>
                    <Input type={'text'} getErrorMsg={getErrorMsg} errors={errors} name={'lastName'} value={form.lastName} handleForm={handleForm} placeholder={'Last name'}/>
                </div>
            </div>

            <div className={'flex space-x-4'}>
                <div className={' w-1/2'}>
                    <Input type={'text'} getErrorMsg={getErrorMsg} errors={errors} name={'username'} value={form.username} handleForm={handleForm} placeholder={'Username'}/>
                </div>
                <div className={'w-1/2'}>
                    <Input type={'email'} getErrorMsg={getErrorMsg} errors={errors} name={'email'} value={form.email} handleForm={handleForm} placeholder={'Email'}/>
                </div>
            </div>

            <Input getErrorMsg={getErrorMsg} errors={errors} type={'password'} name={'password'} value={form.password} handleForm={handleForm} placeholder={'Password'}/>

            <Input getErrorMsg={getErrorMsg} errors={errors} type={'text'} name={'pin'} value={form.pin} handleForm={handleForm} placeholder={'Pin'}/>

            <ModalDialog setSelection={setSelectedAvatar}/>

            {selectedAvatar?.img && <img className={'m-auto my-5'} src={selectedAvatar.img} width={'25%'} />}

            <Select getErrorMsg={getErrorMsg} errors={errors} value={form.type} name={'type'} displayName={'User Type'} handleForm={handleForm} values={[
                {value: 'admin', name: 'Admin'},
                {value: 'user', name: 'Sub User'},
                {value: 'child', name: 'Child'}
            ]}/>

            {adminFieldVisible &&
                <>
                    <span className={'text-white'}>Enter your admin's email address:</span>
                    <div className={'bg-grey-3 h-11 rounded w-full'}>
                        <input ref={adminInput} required className={'h-full  bg-transparent font-semibold placeholder:text-grey-1 text-white w-3/4 border-r-red border-r-2 border-b-0 border-t-0 border-l-0'} type={'email'} name={'admin_email'} placeholder={'admin@example.com'}/>
                        <button onClick={() => verifyAdminEmail(adminInput.current)} className={'w-1/4 font-semibold text-white'}>Confirm</button>
                    </div>
                    <span className={clsx(adminMessage && adminMessage.includes('Error') ? 'text-red' : 'text-green-700')}>{adminMessage}</span>
                </>
            }

            <Select getErrorMsg={getErrorMsg} errors={errors} value={form.language} name={'language'} displayName={'Language'} handleForm={handleForm} values={[
                {value: 'EN', name: 'EN'},
                {value: 'DE', name: 'DE'},
                {value: 'FR', name: 'FR'}
            ]}/>

            <Select getErrorMsg={getErrorMsg} errors={errors} value={form.maturity_setting} name={'maturity_setting'} displayName={'Maturity Setting'} handleForm={handleForm} values={[
                {value: 'unrestricted', name: 'Unrestricted (18+)'},
                {value: 'semi-restricted', name: 'Semi-Restricted'},
                {value: 'restricted', name: 'Restricted (Default if child)'}
            ]}/>

            <Select getErrorMsg={getErrorMsg} errors={errors} value={form.subscription} name={'subscription'} displayName={'Subscription'} handleForm={handleForm} values={[
                {value: 'Movies & Shows', name: 'Movies & Shows'},
                {value: 'Shows', name: 'Shows'},
                {value: 'Movies', name: 'Movies'}
            ]}/>

            <div className={'flex justify-between w-3/4 mb-4'}>
                <div className={'mb-4'}>
                    <label className={'text-white'} htmlFor="autoplay_enabled">Autoplay Enabled </label>
                    {/* For now, this serves no purpose. Disabling. */}
                    <input disabled type="checkbox" name="autoplay_enabled" onChange={handleForm} value="false"/>
                </div>

                <div className={'mb-4'}>
                    <label className={'text-white'} htmlFor="database_admin">Database admin </label>
                    <input type="checkbox" onChange={() => setIsDbAdmin(!isDbAdmin)} name="database_admin" />
                </div>
            </div>

            {/* Register and payment are now the same in the backend, pass user data to stripe form */}
            <StripeForm errors={errors} setErrors={setErrors} loading={loading} setLoading={setLoading} userData={form} />
            <p style={styles}>{errorMessage}</p>
            <p className={'text-grey-1'}>Existing user? <b onClick={switchForms} className={'text-white hover:cursor-pointer'}>Sign in.</b></p>
            <div>
                {loading && <div>
                    <h2 className={'text-white m-auto text-center'}>Registering...</h2>
                    <Oval
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
                /></div>}
            </div>
        </div>
    );
};

export default RegisterForm;