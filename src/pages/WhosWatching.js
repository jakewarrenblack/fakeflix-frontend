import {useEffect, useState, Suspense} from "react";
import axios from "axios";
import {useContext} from "react";
import {AuthContext} from "../utils/AuthContext";
import {useLocation, useNavigate} from "react-router-dom";
import {useImage} from 'react-image'

const WhosWatching = () => {
    const location = useLocation()
    const [users, setUsers] = useState()
    const {token} = useContext(AuthContext)
    const navigate = useNavigate()
    let adminID = location.state.adminID

    // Get admins where _id = x and users where admin_id = x,
    // they're part of the same group
    useEffect(() => {
        // find users where _id = x or admin_id = x
        // must also populate avatars
        axios.get(`${process.env.REACT_APP_URL}/users/manageProfiles/${adminID}?populate=avatar`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            ).then((res) => {
            setUsers(res.data)
        }).catch((e) => {
            console.log(e)
        })
    }, [])

    const UserCard = ({_id, avatar, username , type}) => {
        const AvatarImage = () => {
            // TODO: Give me some loader component
            const {src} = useImage({
                srcList: avatar.img
            })
            return <img src={src} width={'90%'}/>
        }


        return (
            <div onClick={() => navigate('/movies')} className={{display: 'flex', marginTop: 25, justifyContent: 'flex-end'}}>
                <div className={'flex hover:cursor-pointer hover:brightness-100 brightness-75 justify-center flex-col items-center m-2]'}>
                    <Suspense>
                        <AvatarImage/>
                    </Suspense>
                    <h3 className={'font-semibold mt-2 text-white'}>{username}</h3>
                    {/* Showing a crown icon for admins */}
                    {type == 'admin' && '👑'}
                </div>
            </div>
        )

    }

    return (
        <div className={'bg-grey-2 w-screen h-screen flex flex-col justify-center'}>
            <h2 className={'text-white text-center'}>Who's Watching?</h2>
            <div className={'flex items-center'}>
            {
                users?.map((user) => (
                    <UserCard {...user}/>
                ))
            }
            </div>
        </div>
    )
}

export default WhosWatching