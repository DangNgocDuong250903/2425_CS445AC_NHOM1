import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as FriendService from "~/services/FriendService";

const useGetFriendOfUser = (reload = false) => {
    const [friendOfUser, setFriendOfUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const user = useSelector(state => state.user)

    const fetchFriendOfUser = async () => {
        setLoading(true);
        try {
            if (!id) {
                const res = await FriendService.getFriendOfUser({ id: user?.id, token });
                setFriendOfUser(res);
            }
            const res = await FriendService.getFriendOfUser({ id, token });
            if (res) {
                setFriendOfUser(res);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriendOfUser();
    }, [id, reload]);

    return { loading, friendOfUser, reload: fetchFriendOfUser };
};

export default useGetFriendOfUser;