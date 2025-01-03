import { useEffect, useState } from "react";
import * as AdminService from "~/services/AdminService";

const useGetAllUsers = (reload = false) => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    const fetchAllUsers = async () => {
        setLoading(true);
        try {
            const res = await AdminService.getAllUser(token);
            if (res?.code === 1000 && res?.result?.length > 0) {
                setUsers(res?.result);
            }
        } catch (error) {
            console.error("Error fetching users details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, [reload]);

    return { loading, users, reload: fetchAllUsers };
};

export default useGetAllUsers;





