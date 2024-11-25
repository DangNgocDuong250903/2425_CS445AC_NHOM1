import axios from 'axios'

export const register = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/user/register`, data, {
        headers: {
            "x-api-key": "pass"
        }
    })
    return res
}