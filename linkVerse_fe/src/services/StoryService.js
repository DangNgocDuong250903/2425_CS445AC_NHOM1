import { axiosJWT } from "./UserService"

export const createStory = async ({ data, token }) => {
    const formData = new FormData
    formData.append("request", JSON.stringify(data.request));
    if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
            formData.append("files", file);
        });
    } else {
        formData.append('files', new Blob([]));
    }
    const res = await axiosJWT.post(`${import.meta.env.VITE_API_URL_BACKEND}/post/stories`, formData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}

export const getAllStory = async ({ page, token }) => {
    const res = await axiosJWT.get(`${import.meta.env.VITE_API_URL_BACKEND}/post/stories?page=${page}&size=10`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}
