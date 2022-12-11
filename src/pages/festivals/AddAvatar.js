import Input from "../../components/Input";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import clsx from "clsx";
import Select from "../../components/Select";
import handleForm from "../../utils/handleForm";
import {
    formatErrors,
    age_certification_values,
    getErrorMsg,
    arrayToDbFormat,
    age_cert_arr, genreOptions, productionCountryOptions
} from "../../utils/formHelpers";
import TextArea from "../../components/TextArea";
import MultiSelect from "../../components/MultiSelect";
import ImageUploading from "react-images-uploading";

const AddAvatar = () => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const [avatar, setAvatar] = useState({
        "name": null,
        "img": null,
    })

    const [images, setImages] = useState([])

    const onImageChange = (imageList, addUpdateIndex) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
    };

    const [errors, setErrors] = useState([])

    const submitForm = () => {
        setErrors([])

        const file = new FormData()

        file.append('file', avatar.img)

        const formData = {
            name: avatar.name,
            file
        }

        console.log(avatar.img)

        axios
            .post(`${process.env.REACT_APP_URL}/avatars`, {
                // Combine the user data with the stripe token, which is needed for checkout
                ...formData,
            }, {
                headers: {
                    Authorization : `Bearer ${token}`,
                    'Content-Type': `multipart/form-data`
                }
            })
            .then(response => {
                console.log(response);
                alert("Add successful");
            })
            .catch(error => {
                console.log("Add error: ", error);
                setErrors(formatErrors(error.response.data.errors))
                alert("Add failed");
            });
    };


    return <div className={'bg-grey-2 absolute w-full h-max min-h-full'}>
        <div className={'w-1/3 m-auto'}>
            <h1 className={'text-8xl text-white my-5'}>Add Avatar</h1>
            <hr className={'mb-5'}/>
            <div className={'space-y-8'}>
                <div>
                    <Input handleForm={(e) => handleForm(e, setAvatar, avatar)} defaultValue={avatar.name} type='text' name={'name'} id={'name'} getErrorMsg={getErrorMsg} errors={errors} labelValue={'NAME'}/>
                </div>

                <div>
                    {/*<Input handleForm={(e) => handleForm(e, setAvatar, avatar)} defaultValue={avatar.img} type='file' name={'img'} id={'img'} getErrorMsg={getErrorMsg} errors={errors} labelValue={'IMAGE'}/>*/}

                    <ImageUploading
                        value={images}
                        onChange={onImageChange}
                        maxNumber={1}
                        dataURLKey="data_url"
                        acceptType={['jpg', 'png']}
                    >
                        {({
                              imageList,
                              onImageUpload,
                              onImageRemoveAll,
                              onImageUpdate,
                              onImageRemove,
                              isDragging,
                              dragProps,
                          }) => (
                            // write your building UI
                            <div className="mb-10">
                                <button className={'bg-white rounded p-2 mr-4'}
                                    style={isDragging ? { color: 'red' } : undefined}
                                    onClick={onImageUpload}
                                    {...dragProps}
                                >
                                    Add image
                                </button>
                                &nbsp;
                                <button className={'bg-white rounded p-2'} onClick={onImageRemoveAll}>Remove image</button>
                                {imageList.map((image, index) => (
                                    <div key={index} className="mt-8 flex items-center ml-0">
                                        <img className={'bg-white p-2 rounded-sm mr-5'} src={image['data_url']} alt="" width="100" />
                                        <div className="flex flex-col items-start space-y-4">
                                            <button className={'bg-white rounded p-2 w-full'} onClick={() => onImageUpdate(index)}>Update</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ImageUploading>
                </div>
            </div>
        </div>
        <div className={'w-1/3 m-auto flex my-2 space-x-4'}>
            <button onClick={() => submitForm()} className={'px-8 hover:bg-white hover:text-black transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Save</button>
            <button onClick={() => navigate(-1)} className={'px-8 hover:bg-white hover:text-black transition-all py-5 border border-grey-1 bg-grey-2 text-grey-1 text-2xl'}>Cancel</button>
        </div>

    </div>
}

export default AddAvatar