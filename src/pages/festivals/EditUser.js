
import Input from "../../components/Input";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import Loading from "../../components/Loading";
import clsx from "clsx";
import Select from "../../components/Select";
import handleForm from "../../utils/handleForm";
import {
    getErrorMsg,
    arrayFromString,
    arrayToDbFormat,
    age_cert_arr,
    genreOptions,
    productionCountryOptions,
    formatErrors
} from "../../utils/formHelpers";
import MultiSelect from "../../components/MultiSelect";
import {AuthContext} from "../../utils/AuthContext";
import ModalDialog from "../../components/ModalDialog";
import FlashMessage from "../../components/FlashMessage";
import {useAuth} from "../../utils/useAuth";

const EditUser = () => {
    const { id } = useParams();
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const [errors, setErrors] = useState([])
    const [userState, setUserState] = useState()
    const [selectedAvatar, setSelectedAvatar] = useState({})
    const [url, setUrl] = useState()

    const [loading, setLoading] = useState(true)
    const [showDialog, setShowDialog] = useState(false)
    const [deleteConfirmed, setDeleteConfirmed] = useState(false)

    // get the currently logged in user
    const {user} = useContext(AuthContext)

    const {logout} = useAuth()

    console.log('user', user)
    // means user is editing themselves, that's fine, don't pass the id to the url


    // If the id passed through params is the same as the currently logged in user's ID, the user is editing themselves
    // therefore, we don't pass this id to the edit function

    // if the ID passed is not the current user's ID, the user is trying to edit somebody else, in which case they must be an admin
    // if they are an admin, pass that ID to the edit function

    // the backend will verify if it's okay for this admin to edit the user in question (only allowed if they are THAT user's admin)


    useEffect(() => {

        if(deleteConfirmed){
            // if user ID was passed and is not the same as the current user ID, delete another user. Otherwise, deleting themselves.
            axios.delete(`${process.env.REACT_APP_URL}${id !== user._id ? `/users/delete/${id}` : '/users/delete'}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res) => {
                alert('User deleted')
                setLoading(false)
                logout()
                navigate('/')
            }).catch((e) => {
                console.log(e)
            })
        }
    }, [deleteConfirmed])


    // first need to get users info
    useEffect(() => {
        if(user._id === id){
            setUrl(`${process.env.REACT_APP_URL}/users/edit`)
        }
        else {

            // user is trying to edit somebody else. they need to be an admin, make sure they are one
            if (id && user._id !== id) {
                console.log('user', user)
                if (user.type !== 'admin') {
                    //TODO: Replace this with useNavigate, like I've used in login error
                    return navigate('/', {state: {msg: `Only admins may edit other users. You are logged in with account type: ${user.type}`}})

                } else {
                    setUrl(`${process.env.REACT_APP_URL}/users/edit/${id}`)
                }
            } else {
                return navigate('/', {state: {msg: 'Something went wrong.'}})
            }
        }

        // ID passed, we're retrieving somebody else
        axios.post(`${process.env.REACT_APP_URL}/users/getProfileById`, {
                id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).then((res) => {
            // scenario 1:
            // admin is logged in, they're requesting their own account (user._id === id)
            // dont make any changes to the res.data
            if(user.type === 'admin' && id === user._id){
                setUserState(res.data)
            }
            else if(user.type !== 'admin'){
                // scenario 2:
                // a non-admin is logged in
                // remove the admin and type fields from the object
                setUserState({
                    ...res.data,
                    admin: null,
                    type: null
                });
            }
            else if(user.type === 'admin' && id !== user._id){
                // scenario 3:
                // an admin is logged in, they are requesting an account other than their own
                // remove the admin, password, email fields from the object
                setUserState({
                    ...res.data,
                    admin: null,
                    email: null,
                    password: null
                });
            }
            else{
                return navigate('/', {state: {msg: 'Something went wrong.'}})
            }

            setSelectedAvatar(res.data.avatar)
            setLoading(!loading)
        }).catch((e) => {
            console.log(e)
        })
    }, [id])

    useEffect(() => {
        setUserState(userState => ({
            ...userState,
            avatar: selectedAvatar._id
        }))
    }, [selectedAvatar])


    const submitForm = () => {

        axios
            .put(url, {
                // Combine the user data with the stripe token, which is needed for checkout
                ...userState,
            }, {
                headers: {
                    Authorization : `Bearer ${token}`
                }
            })
            .then(response => {
                console.log(response);
                alert("Edit successful");
            })
            .catch(error => {
                console.log("Edit error: ", error);

                if(error.response.data.errors) {
                    alert("Edit failed");
                    setErrors(formatErrors(error.response.data.errors))
                }
                else if(error.response.data.message){
                    alert(error.response.data.message)
                }
            });
    };

    if(loading) return <Loading loadingMsg={'Loading user details'}/>

    const hiddenFields = [
     '_id' ,
     'updatedAt' ,
     '__v',
     'createdAt',
     'stripe_details',
     'password',
     'database_admin',
      'my_list',
        'autoplay_enabled',
        'admin'
    ]

    return <>
        {showDialog && <FlashMessage setShowDialog={setShowDialog} translate={true} action={setDeleteConfirmed} msg={`${user.type === 'admin' ? 'Are you sure? As an admin, deleting your own account will also delete any users tied to your account.' : 'Are you sure you want to delete your profile?'}`}/>}
        <div className={'bg-grey-2 absolute w-full h-max min-h-full'}>
        <div className={'w-1/3 m-auto'}>
            <h1 className={'text-8xl text-white my-5'}>Edit User</h1>
            <hr className={'mb-5'}/>
            <div className={'space-y-8'}>
                {
                    Object.keys(userState)
                        .map((key) => {
                            if(key === 'type') {
                                return <Select getErrorMsg={getErrorMsg} errors={errors} defaultValue={userState[key]} name={key} displayName={key.toUpperCase()} handleForm={(e) => handleForm(e, setUserState, userState)} values={[
                                    {value: 'admin', name: 'Admin'},
                                    {value: 'user', name: 'Sub User'},
                                    {value: 'child', name: 'Child'}
                                ]}/>
                            }

                            if(key === 'language') {
                                return <Select getErrorMsg={getErrorMsg} errors={errors} defaultValue={userState[key]} name={key} displayName={key.toUpperCase()} handleForm={(e) => handleForm(e, setUserState, userState)} values={[
                                    {value: 'EN', name: 'EN'},
                                    {value: 'DE', name: 'DE'},
                                    {value: 'FR', name: 'FR'}
                                ]}/>
                            }

                            if(key === 'maturity_setting') {
                                return <Select getErrorMsg={getErrorMsg} errors={errors} defaultValue={userState[key]}
                                               name={key} displayName={key.toUpperCase()}
                                               handleForm={(e) => handleForm(e, setUserState, userState)} values={[
                                    {value: 'unrestricted', name: 'Unrestricted (18+)'},
                                    {value: 'semi-restricted', name: 'Semi-Restricted'},
                                    {value: 'restricted', name: 'Restricted (Default if child)'}
                                ]}/>
                            }

                            if(key === 'subscription') {

                                return <Select getErrorMsg={getErrorMsg} errors={errors} defaultValue={userState[key]}
                                               name={key} displayName={key.toUpperCase()}
                                               handleForm={(e) => handleForm(e, setUserState, userState)} values={[
                                    {value: 'Movies & Shows', name: 'Movies & Shows'},
                                    {value: 'Shows', name: 'Shows'},
                                    {value: 'Movies', name: 'Movies'}
                                ]}/>
                            }

                            if(key === 'avatar') {
                             return  (
                                 <div className={'flex flex-col items-center'}>
                                    <ModalDialog setSelection={setSelectedAvatar}/>
                                    {selectedAvatar?.img && <img className={'m-auto my-5'} src={selectedAvatar.img} width={'25%'} />}
                                 </div>
                             )
                            }

                            return (
                                <div className={clsx(hiddenFields.includes(key)  && 'hidden')}>
                                    <Input getErrorMsg={getErrorMsg} errors={errors} defaultValue={userState[key]} type={typeof(userState[key])} name={key} id={key} handleForm={(e) => handleForm(e, setUserState, userState)} labelValue={key.replaceAll('_', ' ').toUpperCase()}/>
                                </div>
                            )
                        })
                }
            </div>
        </div>
        <div className={'w-1/3 m-auto flex my-2 space-x-4'}>
            <button onClick={() => submitForm()} className={'px-8 hover:bg-white hover:text-black transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Save</button>
            <button onClick={() => navigate(-1)} className={'px-8 hover:bg-white hover:text-black transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Cancel</button>
            <button onClick={() => setShowDialog(true)} className={'px-8 hover:bg-red hover:text-white transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Delete</button>
        </div>

    </div>
        </>
}

export default EditUser