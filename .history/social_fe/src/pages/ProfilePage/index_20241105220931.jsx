import { CiFacebook } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";


const Profile = () => {
  const navigate = useNavigate()
  return (
    <>
      <TopBar></TopBar>
      <div className="flex items-center justify-center pt-20">
        <div className="relative p-6 bg-white rounded-lg shadow-md w-[700px] h-[600px] border border-gray-400">
          <IoIosCloseCircleOutline onClick={() => navigate("/")} className="absolute w-8 h-8 cursor-pointer top-4 right-4 hover:text-red-400 " />
          <div className="flex items-center justify-between mt-7">
            <div>
              <h1 className="text-2xl font-bold">phan thanh</h1>
              <p className="text-gray-500">phanthanh1002</p>
              <div className="flex items-center object-cover mt-3">
                <img src="https://mighty.tools/mockmind-api/content/human/72.jpg" alt="Follower 1" className="w-8 h-8 rounded-full" />
                <img src="https://mighty.tools/mockmind-api/content/human/38.jpg" alt="Follower 2" className="w-8 h-8 -ml-2 rounded-full" />
                <img src="https://mighty.tools/mockmind-api/content/human/49.jpg" alt="Follower 3" className="w-8 h-8 -ml-2 rounded-full" />
                <img src="https://mighty.tools/mockmind-api/content/human/61.jpg" alt="Follower 4" className="w-8 h-8 -ml-2 rounded-full" />
                <span className="ml-2 text-gray-500">4 followers</span>
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww" alt="Profile" className="items-center object-cover w-20 h-20 rounded-full" />
          </div>
          <div className="flex justify-end gap-2 mt-4 cursor-pointer ">
            <CiFacebook className="w-6 h-6" />
            <FaInstagram className="w-6 h-6" />
          </div>
          <div className="flex gap-5 p-2">
            <Link to="/update_user" className="w-full px-4 py-2 mt-4 font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-200">
              Chỉnh sửa trang cá nhân
            </Link>
            <Link className="w-full px-4 py-2 mt-4 font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-200">
              Chia sẽ trang cá nhân
            </Link>
          </div>
          <div className="flex justify-between mt-10 text-gray-400 cursor-pointer ">
            <td className=" font-semibold hover:text-black hover:shadow-[0_3px_0_-1px] px-2">post</td>
            <td className="font-semibold hover:text-black hover:shadow-[0_3px_0_-1px] px-2">followers</td>
            <td className="font-semibold hover:text-black hover:shadow-[0_3px_0_-1px] px-2">following</td>
          </div>
        </div>
        {/*  */}
      </div>
    </>

  );

};

export default Profile;
