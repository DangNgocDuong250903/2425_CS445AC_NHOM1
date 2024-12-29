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

export const update = async ({ token, data }) => {
    const res = await axiosJWT.put(`${import.meta.env.VITE_API_URL_BACKEND}/identity/users/my-profile`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data
}

export const block = async ({ id, token }) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/profile/block?targetUserId=${id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const unBlock = async ({ id, token }) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/profile/unblock?targetUserId=${id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const blockList = async (token) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/profile/block-list`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const getDetailUser = async ({ id, token }) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/profile/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data
}

export const getDetailUserByUserId = async ({ id, token }) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/identity/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data
}

export const updateStatus = async ({ status, token }) => {
    const res = await axiosJWT.patch(`${import.meta.env.VITE_API_URL_BACKEND}/identity/users/my-profile/status?status=${status}`, {}, {
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

export const verifyEmail = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND_2}/notification/email/send-verification?email=${data}`);
    return res.data;
}

export const verify = async ({ data, token }) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND_2}/notification/email/verify?token=${data}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
}

export const setAvatar = async ({ file, token }) => {
    const formData = new FormData
    formData.append("request", { content: "Update avatar" });
    formData.append("avatar", file);

    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/post/set-avatar`, formData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const disableAcount = async ({ token, password }) => {
    const res = await axiosJWT.delete(`${import.meta.env.VITE_API_URL_BACKEND}/identity/users/delete?password=${password}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const deleteAccount = async ({ token, password }) => {
    const res = await axiosJWT.delete(`${import.meta.env.VITE_API_URL_BACKEND}/identity/users/delete-permanently?password=${password}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}



