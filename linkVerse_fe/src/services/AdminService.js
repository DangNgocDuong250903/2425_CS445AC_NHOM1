import axios from "axios"

export const getAllUser = async (token) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/identity/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const getListHistory = async (token) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/post/history`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}
