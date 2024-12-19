import { axiosJWT } from "./UserService"

export const friendSuggesstion = async (token) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/profile/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const accept = async (token) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/profile/friends/accept`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data
}

export const request = async ({ id, token }) => {
    const formData = new FormData
    formData.append("recipientUserId", id);
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/profile/friends/request`, formData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const reject = async ({ id, token }) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/profile/friends/request`, formData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

