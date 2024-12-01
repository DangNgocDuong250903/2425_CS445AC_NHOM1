import axios from "axios"

export const createPost = async (data) => {
    const { postedBy } = data
    const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/post/create-post`, data, {
        headers: {
            "x-api-key": "pass",
            "x-client-id": postedBy
        }
    })
    return res.data
}
