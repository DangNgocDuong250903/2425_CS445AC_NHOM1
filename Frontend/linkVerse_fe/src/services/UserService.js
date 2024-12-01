import axios from 'axios'

export const axiosJWT = axios.create()

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

export const logout = async (id, token) => {
    const res = await axios.post(
        `${import.meta.env.VITE_API_URL_BACKEND}/user/logout`,
        {},
        {
            headers: {
                "x-api-key": "pass",
                "x-client-id": id,
                "authorization": token
            }
        }
    );
    return res.data;
};

export const getDetailUser = async (id, token) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/user/get-detail/${id}`, {
        headers: {
            "x-api-key": "pass",
            "x-client-id": id,
            "authorization": token
        }
    })

    return res.data
}

export const handleRefreshToken = async (id) => {
    const res = await axios.post(
        `${import.meta.env.VITE_API_URL_BACKEND}/user/handleRefreshToken`,
        {},
        {
            headers: {
                "x-api-key": "pass",
                "x-client-id": id,
            },
            withCredentials: true,
        }
    );
    return res.data;
};

