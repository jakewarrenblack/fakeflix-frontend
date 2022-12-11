import {useEffect, useState, Suspense} from "react";
import axios from "axios";
import {useContext} from "react";
import {AuthContext} from "../utils/AuthContext";
import {useLocation, useNavigate} from "react-router-dom";
import {useImage} from 'react-image'
import Loading from "../components/Loading";

const WhosWatching = () => {
    const location = useLocation()
    const [users, setUsers] = useState()
    const {token, user} = useContext(AuthContext)
    const navigate = useNavigate()
    let adminID;
    const [loading, setLoading] = useState(true)

    // To decide which route to automatically direct a user to when they log in
    // So a user subscribed to movies and shows goes to /all
    // But a user subscribed specifically to movies or shows only goes to that respective route
    let direct;

    if(user) {
        if (user.type === 'admin') {
            adminID = user._id
        } else {
            adminID = user.admin
        }

        if(user.subscription == 'Shows' || user.subscription == 'Movies'){
            direct = `/${user.subscription.toLowerCase()}`
        }
        else{
            // must be subscribed to both movies and shows
            direct = '/all'
        }

    }


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
            setLoading(false)
        }).catch((e) => {
            console.log(e)
            setLoading(false)
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
            <div className={'flex flex-end mt-12'} onClick={() => navigate(direct ?? '/')}>
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
            <div className={'flex justify-center items-center'}>
            {
                !loading ? users?.map((user) => (
                    <UserCard {...user}/>
                )) : <Loading msg={'Loading users'}/>
            }
            </div>
        </div>
    )
}

export default WhosWatching