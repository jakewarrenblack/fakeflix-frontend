import Input from "../../components/Input";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import handleForm from "../../utils/handleForm";
import {
    formatErrors,
    getErrorMsg,
} from "../../utils/formHelpers";
import ImageUploading from "react-images-uploading";

const AddAvatar = () => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const [avatar, setAvatar] = useState({
        name: null,
        file: null,
    })

    const [errors, setErrors] = useState([])

    const [message, setMessage] = useState(null)

    const getImage = e => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setAvatar({
                name: avatar.name,
                file
            })
        }
    };

    const uploadFile = async () => {
        const url = 'http://localhost:3000/api/avatars/list-objects';

        await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {

            const { file } = avatar
            console.log(file)
            const contentType = 'image/png'

            let fileName = encodeURIComponent(`${res?.data?.length+1}.${file.name.split('.')[1]}`)

            console.log('filename', fileName)

            const generatePutUrl = 'http://localhost:3000/api/avatars/generate-put-url';
            const options = {
                params: {
                    Key: fileName,
                    ContentType: contentType
                },
                headers: {
                    'Content-Type': contentType
                }
            };

            axios.get(generatePutUrl, {...options}).then(res => {
                const {
                    data: { putURL }
                } = res;
                axios
                    .put(putURL, file, {...options})
                    .then(res => {
                        // now upload to mongodb
                        const formData = {
                            name: avatar.name,
                            img: fileName
                        }

                        axios
                            .post(`http://localhost:3000/api/avatars`, {
                                // Combine the user data with the stripe token, which is needed for checkout
                                ...formData
                            }, {
                                headers: {
                                    Authorization : `Bearer ${token}`,
                                }
                            })
                            .then(response => {
                                console.log(response);
                                console.log(res)
                                setMessage('Success!')
                                // clear message after 2s
                                setTimeout(()=>{
                                    setMessage(null)
                                }, 2000)
                            })
                            .catch(error => {
                                console.log("Add error: ", error);
                                setErrors(formatErrors(error.response.data.errors))
                                alert("Add failed");
                            });

                    })
                    .catch(err => {
                        setMessage('Something went wrong')
                        console.log('err', err);
                    });
            });
        }).catch((e) => console.log(e))
    };

    return <div className={'bg-grey-2 absolute w-full h-max min-h-full'}>
        <div className={'w-1/3 m-auto'}>
            <h1 className={'text-8xl text-white my-5'}>Add Avatar</h1>
            <hr className={'mb-5'}/>

            {message !== '' && <span className={'text-white text-center'}>{message}</span>}
            <div className={'space-y-8'}>
                <div>
                    <Input handleForm={(e) => handleForm(e, setAvatar, avatar)} defaultValue={avatar.name} type='text' name={'name'} id={'name'} getErrorMsg={getErrorMsg} errors={errors} labelValue={'NAME'}/>
                </div>

                <input
                    required
                    className={'text-white'}
                    id='upload-image'
                    name='file'
                    type='file'
                    accept='image/png'
                    onChange={getImage}
                />
            </div>
        </div>
        <div className={'w-1/3 mt-8 m-auto flex my-2 space-x-4'}>
            <button onClick={() => uploadFile()} className={'px-8 hover:bg-white hover:text-black transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Save</button>
            <button onClick={() => navigate(-1)} className={'px-8 hover:bg-white hover:text-black transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Cancel</button>
        </div>

    </div>
}

export default AddAvatar