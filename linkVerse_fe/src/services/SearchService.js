import axios from "axios"

export const searchUser = async ({ token, keyword }) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/profile/search?page=0&size=10&search=${keyword}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}