import { useEffect, useState } from "react";
import * as FriendService from "~/services/FriendService";

const useGetFriendRequest = (reload = false) => {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    const fetchFriendRequest = async () => {
        setLoading(true);
        try {
            const res = await FriendService.friendSuggesstion(token);
            if (res?.code === 1000) {
                setRequests(res?.result);
            }
        } catch (error) {
            console.error("Error fetching friends details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriendRequest();
    }, [reload]);

    return { loading, requests, reload: fetchFriendRequest };
};

export default useGetFriendRequest;
