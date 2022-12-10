
import Input from "../../components/Input";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import Loading from "../../components/Loading";
import clsx from "clsx";
import Select from "../../components/Select";
import handleForm from "../../utils/handleForm";
import {getErrorMsg, arrayFromString,arrayToDbFormat, age_cert_arr, genreOptions, productionCountryOptions} from "../../utils/formHelpers";
import MultiSelect from "../../components/MultiSelect";
import {AuthContext} from "../../utils/AuthContext";

const EditUser = () => {
    const { id } = useParams();
    const [title, setTitle] = useState(null)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const [errors, setErrors] = useState([])
    const [userState, setUserState] = useState([])

    // get the currently logged in user
    const {user} = useContext(AuthContext)
    let url;

    // means user is editing themselves, that's fine, don't pass the id to the url


    // If the id passed through params is the same as the currently logged in user's ID, the user is editing themselves
    // therefore, we don't pass this id to the edit function

    // if the ID passed is not the current user's ID, the user is trying to edit somebody else, in which case they must be an admin
    // if they are an admin, pass that ID to the edit function

    // the backend will verify if it's okay for this admin to edit the user in question (only allowed if they are THAT user's admin)

    // first need to get users info
    useEffect(() => {
        if(id && user._id === id){
            url = `${process.env.REACT_APP_URL}/users/edit`
        }

        // user is trying to edit somebody else. they need to be an admin, make sure they are one
        if(id && user._id !== id){
            if(user.type !== 'admin'){
                return <Navigate
                    to={'/'}
                    state={{msg: `Only admins may edit other users!.`}}
                />
            }
            else{
                url = `${process.env.REACT_APP_URL}/users/edit/${id}`
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
            console.log(res.data)
            setUserState(res.data)
        }).catch((e) => {
            console.log(e)
        })
    }, [])


    const submitForm = () => {
        axios
            .put(url, {
                // Combine the user data with the stripe token, which is needed for checkout
                ...user,
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
                alert("Edit failed");
            });
    };

    if(!userState) return <Loading/>

    const hiddenFields = [
     '_id' ,
     'updatedAt' ,
     '__v',
     'createdAt',
     'stripe_details',
     'password'
    ]

    return <div className={'bg-grey-2 absolute w-full h-max min-h-full'}>
        <div className={'w-1/3 m-auto'}>
            <h1 className={'text-8xl text-white my-5'}>Edit User</h1>
            <hr className={'mb-5'}/>
            <div className={'space-y-8'}>
                {
                    Object.keys(userState)
                        .map((key) => {
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
            <button className={'px-8 hover:bg-red hover:text-white transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Delete</button>
        </div>

    </div>
}

export default EditUser