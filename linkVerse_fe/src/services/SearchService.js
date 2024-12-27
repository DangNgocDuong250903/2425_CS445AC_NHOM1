import axios from "axios"

export const searchUser = async ({ token, keyword }) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/profile/search?page=0&size=10&search=${keyword}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const searchPost = async ({ size, page, token, content }) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/post/search?page=${page}&size=${size}&content=${content}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const searchPostByKeyword = async ({ token, keyword }) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/post/searchPostKeyword?keyword=${keyword}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const searchPostByHashTag = async ({ token, hashtag }) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/post/hashtags/${hashtag}/posts`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}