import { axiosJWT } from "./UserService"

export const friendSuggesstion = async (token) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/profile/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const accept = async ({ id, token }) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/profile/friends/accept?senderUserId=${id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const request = async ({ id, token }) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/profile/friends/request?recipientUserId=${id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const reject = async ({ id, token }) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/profile/friends/reject?senderUserId=${id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const unfriend = async ({ id, token }) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/profile/friends/unfriend?recipientUserId=${id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const getFriendOfUser = async ({ id, token }) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/profile/friends/friend?userId=${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const getFriendRequests = async (token) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/profile/friends/my-friend-request`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const getRequestSend = async (token) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/profile/friends/request-sent`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const getMyFriends = async (token) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/profile/friends/my-friends`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

