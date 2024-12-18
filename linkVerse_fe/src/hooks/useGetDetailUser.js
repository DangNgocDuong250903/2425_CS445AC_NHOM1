import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import * as UserService from "~/services/UserService"

const useGetDetailUser = () => {
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    const token = localStorage.getItem("token")

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await UserService.getDetailUserByUserId({ id, token })
                if (res?.code === 1000) {
                    setUser(res?.result)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        getUser()
    }, [id])

    return { loading, user }
}

export default useGetDetailUser