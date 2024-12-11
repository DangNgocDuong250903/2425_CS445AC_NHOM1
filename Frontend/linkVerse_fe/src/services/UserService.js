import axios from 'axios'

export const axiosJWT = axios.create()

export const register = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/identity/users/registration`, data)
    return res.data
}

export const login = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/identity/auth/token`, data)
    return res.data
}

export const logout = async (token) => {
    const res = await axios.post(
        `${import.meta.env.VITE_API_URL_BACKEND}/identity/auth/logout`, { token });
    return res.data;
};

export const update = async (data) => {
    const { id, token } = data
    const res = await axiosJWT.patch(`${import.meta.env.VITE_API_URL_BACKEND}/user/${id}`, data, {
        headers: {
            "x-api-key": "pass",
            "x-client-id": id,
            "authorization": token
        }
    })

    return res.data
}

export const getDetailUser = async (id, token) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/profile/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data
}

export const handleRefreshToken = async (token) => {
    const res = await axios.post(
        `${import.meta.env.VITE_API_URL_BACKEND}/identity/auth/refresh`,
        { token },
    );
    return res.data;
};

export const forgotPassword = async (data) => {
    const res = await axios.post(
        `${import.meta.env.VITE_API_URL_BACKEND_2}/notification/email/send-forget-pass?email=${data.email}`);
    return res.data
}

export const resetPassword = async ({ token, password }) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND_2}/notification/email/reset-password?token=${token}&newPassword=${password}`);
    return res.data;
}


