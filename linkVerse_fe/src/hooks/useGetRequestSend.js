import { useEffect, useState } from "react";
import * as FriendService from "~/services/FriendService";

const useGetRequestSend = (reload = false) => {
    const [requestsSend, setRequestsSend] = useState([])
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    const fetchRequestSend = async () => {
        setLoading(true);
        try {
            const res = await FriendService.getRequestSend(token);
            if (res && res?.length > 0) {
                setRequestsSend(res);
            }
        } catch (error) {
            console.error("Error fetching friends details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequestSend();
    }, [reload]);

    return { loading, requestsSend, reload: fetchRequestSend };
};

export default useGetRequestSend;