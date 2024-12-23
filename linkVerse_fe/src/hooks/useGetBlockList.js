import { useEffect, useState } from "react";
import * as UserService from "~/services/UserService";

const useGetBlockList = (reload = false) => {
    const [blocks, setBlock] = useState([])
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    const fetchBlockList = async () => {
        setLoading(true);
        try {
            const res = await UserService.blockList(token);
            if (res?.length > 0) {
                setBlock(res);
            }
        } catch (error) {
            console.error("Error fetching friends details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlockList();
    }, [reload]);

    return { loading, blocks, reload: fetchBlockList };
};

export default useGetBlockList;
