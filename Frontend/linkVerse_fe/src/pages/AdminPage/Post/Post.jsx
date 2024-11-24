import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaRegListAlt } from "react-icons/fa";
import PostItem from './PostItem';
import { toast } from 'react-toastify';
import SortAdmin from '~/components/Admin/SortAdmin';

const Post = () => {
    const [post, setPost] = useState([])
    const [searchPost, setSearchPost] = useState();
    const [filterPost, setFilterPost] = useState([])
    const [selectedSort, setSelectedSort] = useState({
        sortBy: "",
        sortValue: ""
    });
    const onSort = (sortBy, sortValue) => {
        setSelectedSort({ sortBy, sortValue });
        console.log("Sort selected in App:", sortBy, sortValue);
    }
    const getPost = async () => {
        try {
            const res = await axios.get("https://673def430118dbfe86096cf6.mockapi.io/post")
            setPost(res.data)
            setFilterPost(res.data)
        } catch (error) {
            alert("Lỗi kết nối với server")
        }
    }
    useEffect(() => {
        getPost()
    }, [])

    const handleSearch = () => {
        const result = post.filter(
            (item) =>
                item.author.toLowerCase().includes(searchPost.toLowerCase()) ||
                item.title.toLowerCase().includes(searchPost.toLowerCase())
        );
        setFilterPost(result)
    };






    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchPost(value);
        if (value.trim() === "") {
            setFilterPost(post); // Khi ô input trống, hiển thị toàn bộ danh sách
        }
    };

    //xóa bài viết
    const deletePostItem = async (id) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?");
        if (isConfirmed) {
            try {
                const res = await axios.delete("https://673def430118dbfe86096cf6.mockapi.io/post/" + id)
                toast.success("Đã xóa thành công")
                getPost();
            } catch (error) {
                toast.error("Lỗi không thể xóa");
            }
        }
    }
    return (

        <div className='px-20'>
            <div className='flex items-center justify-center gap-5 mb-5'>
                <FaRegListAlt className='w-6 h-6' />
                <h1 className='text-2xl font-bold'>QUẢN LÝ BÀI VIẾT</h1>
            </div>
            <div className="flex justify-center gap-5 mb-4 items-cent">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="w-1/2 px-6 py-3 border rounded-lg "
                    onChange={handleInputChange}
                />
                <button
                    style={{ backgroundColor: '#3B82F6' }}
                    className="px-2 py-2 text-white rounded-lg "
                    onClick={handleSearch}
                >
                    Tìm kiếm
                </button>
                <div className=''>
                    <select
                        className="px-4 py-2 bg-gray-200 border rounded cursor-pointer"
                    >
                        <option value="-1" className="font-medium">Tất Cả</option>
                        <option className="font-medium" value="1">Công khai</option>
                        <option className="font-medium" value="0">Ẩn</option>
                    </select>
                </div>
            </div>
            <table className="w-full mt-5 bg-white ">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">STT</th>
                        <th className="px-4 py-2 border-b">TIÊU ĐỀ</th>
                        <th className="px-4 py-2 border-b">TÁC GIẢ</th>
                        <th className="px-4 py-2 border-b">NGÀY ĐĂNG</th>
                        <th className="px-4 py-2 border-b">TRẠNG THÁI</th>
                        <th className="px-4 py-2 border-b">HÀNH ĐỘNG</th>
                    </tr>
                </thead>
                <tbody>
                    {filterPost.length > 0 ? (
                        filterPost.map((item, index) => (
                            <PostItem key={index} item={item} deletePostItem={deletePostItem}></PostItem>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="p-2 text-base font-medium text-center">Không tìm thấy</td>
                        </tr>
                    )
                    }

                </tbody>
            </table>
        </div>
    );
};
export default Post