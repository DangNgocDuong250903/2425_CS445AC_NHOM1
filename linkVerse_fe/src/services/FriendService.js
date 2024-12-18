import axios from "axios"
import { axiosJWT } from "./UserService"

export const friendSuggesstion = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/identity/users/random`)
    return res.data
}

export const accept = async (token) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/friend/friendships//request`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data
}

export const request = async () => {

}

export const denie = async () => {

}