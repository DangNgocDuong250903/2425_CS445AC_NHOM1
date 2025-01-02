import axios from "axios";
import { axiosJWT } from "./UserService";

export const createPost = async ({ data, token }) => {
    const formData = new FormData
    formData.append("request", JSON.stringify(data.request));
    if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
            formData.append("files", file);
        });
    } else {
        formData.append('files', new Blob([]));
    }

    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/post/post-file`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;

};

export const getMyPosts = async (token) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/post/my-posts`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const translatePost = async ({ id, language, token }) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/post/${id}/translate?targetLanguage=${language}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const getPostsBySentiment = async ({ page, sentiment, token }) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/post/by-sentiment?page=${page}&size=10&sentiment=${sentiment}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const getPostsById = async ({ id, token, page }) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/post/user-posts?page=${page}&size=10&userId=${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const getAllPosts = async (page) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/post/all?page=${page}`)
    return res.data
}

export const deletePost = async ({ id, token }) => {
    const res = await axiosJWT.delete(`${import.meta.env.VITE_API_URL_BACKEND}/post/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const comment = async ({ id, token, data }) => {
    const formData = new FormData
    formData.append("request", JSON.stringify(data.request));
    if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
            formData.append("files", file);
        });
    } else {
        formData.append('files', new Blob([]));
    }
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/post/comments/${id}/comment-file`, formData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const deleteComment = async ({ postId, commentId, token }) => {
    const res = await axiosJWT.delete(`${import.meta.env.VITE_API_URL_BACKEND}/post/comments/${postId}/comments/${commentId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const editComment = async ({ postId, commentId, data, token }) => {
    const res = await axiosJWT.put(`${import.meta.env.VITE_API_URL_BACKEND}/post/${postId}/comments/${commentId}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const like = async ({ id, emoji, token }) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/post/${id}/like?emoji=${emoji}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const dislike = async ({ id, token }) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/post/${id}/unlikes`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const share = async ({ id, token }) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/post/${id}/share`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const save = async ({ id, token }) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/post/${id}/save`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }

    })
    return res.data
}

export const unsave = async ({ id, token }) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/post/${id}/unsave`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }

    })
    return res.data
}

export const getSaveds = async (token) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/post/saved-posts`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const getPostById = async ({ id, token }) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/post/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return res.data
}

export const changeVisibility = async ({ id, token, visibility }) => {
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/post/${id}/change-visibility?postId=${id}&visibility=${visibility}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

