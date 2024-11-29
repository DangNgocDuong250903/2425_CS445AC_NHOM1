import axios from 'axios'

export const register = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/user/register`, data, {
        headers: {
            "x-api-key": "pass"
        }
    })
    return res.data
}

export const login = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/user/login`, data, {
        headers: {
            "x-api-key": "pass"
        }
    })
    return res.data
}

export const getDetailUser = async (id, token) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/user/get-detail/${id}`, {
        headers: {
            "x-api-key": "pass",
            "x-client-id": id,
            "authorization": token
        }
    })
    return res.data
}