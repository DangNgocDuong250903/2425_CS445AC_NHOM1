import { useEffect, useState } from "react";
import * as UserService from "~/services/UserService";

const useGetDetailUserById = ({ reload = false, id }) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await UserService.getDetailUserByUserId({ id, token });
            if (res?.code === 1000) {
                setUser(res?.result);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id, reload]);

    return { loading, user, reload: fetchUser };
};

export default useGetDetailUserById;
