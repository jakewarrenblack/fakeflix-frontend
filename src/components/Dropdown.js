import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../utils/AuthContext";
import axios from "axios";
import {useAuth} from "../utils/useAuth";
import {useNavigate} from "react-router-dom";

const Dropdown = ({logout}) => {
    const [users, setUsers] = useState()
    const {token, user} = useContext(AuthContext)
    let adminID;

    if (user) {
        if (user.type === 'admin') {
            adminID = user._id
        } else {
            adminID = user.admin
        }
    }

    const [selectedUser, setSelectedUser] = useState()

    const navigate = useNavigate()

    // must get all users first, display entire 'family' of users in dropdown along with their profile images
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}/users/manageProfiles/${adminID}?populate=avatar&populate=admin`,
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

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="IconButton" aria-label="Customise options">
                    Account
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal className={''}>
                <DropdownMenu.Content className="z-[100] bg-white px-5 py-2 rounded" sideOffset={5}>
                    <DropdownMenu.Label className="DropdownMenuLabel">Users</DropdownMenu.Label>

                    {
                        users?.map((user) => {
                            return (
                                <DropdownMenu.Item onClick={() => navigate(`/editUser/${user._id}`)} className="flex">
                                    <div className="mr-2 group hover:cursor-pointer transition-all p-1 rounded hover:bg-navBlack/50 flex"><img width={'25px'} src={user.avatar.img}/> {user.username} <i className={'rotate-45 invisible group-hover:visible'}>✏</i></div>
                                </DropdownMenu.Item>
                            )
                        })
                    }

                    <DropdownMenu.Separator className="border pt-2 mb-2 border-b-black" />

                    <DropdownMenu.Item onClick={logout} className="bg-red rounded-sm text-white font-semibold text-center p-1">
                        Logout
                    </DropdownMenu.Item>

                    <DropdownMenu.Arrow className={'fill-white'} />
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};


export default Dropdown