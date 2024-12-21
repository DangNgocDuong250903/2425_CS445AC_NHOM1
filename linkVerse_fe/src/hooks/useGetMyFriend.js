import { useEffect, useState } from "react";
import * as FriendService from "~/services/FriendService";

const useGetMyFriend = (reload = false) => {
    const [friends, setFriends] = useState([])
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    const fetchMyFriend = async () => {
        setLoading(true);
        try {
            const res = await FriendService.getMyFriends(token);
            if (res?.length > 0) {
                setFriends(res);
            }
        } catch (error) {
            console.error("Error fetching friends details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyFriend();
    }, [reload]);

    return { loading, friends, reload: fetchMyFriend };
};

export default useGetMyFriend;
