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

export const getPost = async (token) => {
    const res = axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/post/my-posts`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}
