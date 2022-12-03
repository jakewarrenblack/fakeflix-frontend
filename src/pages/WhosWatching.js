import {useEffect, useState} from "react";
import axios from "axios";
import {useContext} from "react";
import {AuthContext} from "../utils/AuthContext";
import {useLocation, useParams} from "react-router-dom";

const WhosWatching = () => {
    const location = useLocation()

    const [users, setUsers] = useState()
    const {token} = useContext(AuthContext)

    let adminID = location.state.adminID

    console.log(adminID)

    // Get admins where _id = x and users where admin_id = x,
    // they're part of the same group
    useEffect(() => {
        // find users where _id = x or admin_id = x
        // must also populate avatars
        axios.get(`http://localhost:3000/api/users/manageProfiles/${adminID}?populate=avatar`,

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            ).then((res) => {
            console.log(res.data)

            setUsers(res.data)
        }).catch((e) => {
            console.log(e)
        })
    }, [])

    const UserCard = ({_id, avatar, username , type}) => {
        // All users beneath an admin will share the same subscription type
        // TODO: Unsure of specifics, I will need to do a few things from here,
        // now that we've selected a specific user from the family group

        return (
            <div className={{display: 'flex', marginTop: 25, justifyContent: 'flex-end'}}>
                <div className={'flex hover:cursor-pointer hover:brightness-100 brightness-75 justify-center flex-col items-center m-2]'}>
                    <img src={avatar.img} width={'90%'}/>
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