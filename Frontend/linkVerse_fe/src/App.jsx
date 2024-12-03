import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { route } from "./routes";
import { useEffect } from "react";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserService from "~/services/UserService";
import { updateUser } from "./redux/Slices/userSlice";

function App() {
  const { theme } = useSelector((state) => state.theme);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const { decoded, token } = handleDecoded();
    if (decoded?.userId) {
      handleGetDetailUser(decoded?.userId, token);
    }
  }, []);

  const handleDecoded = () => {
    let token = localStorage.getItem("access_token");
    let decoded = {};
    if (token && isJsonString(token)) {
      token = JSON.parse(token);
      decoded = jwtDecode(token);
    }
    return { decoded, token };
  };

  UserService.axiosJWT.interceptors.request.use(
    async function (config) {
      try {
        const { decoded } = handleDecoded();
        const currentTime = new Date();
        if (decoded?.exp < currentTime.getTime() / 1000) {
          const data = await UserService.handleRefreshToken(decoded?.userId);
          config.headers["x-api-key"] = "pass";
          config.headers["x-client-id"] = decoded?.userId;
          config.headers["authorization"] =
            data?.message?.metaData?.tokens?.accessToken;
        }
        return config;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  const handleGetDetailUser = async (id, token) => {
    try {
      const res = await UserService.getDetailUser(id, token);
      dispatch(updateUser({ ...res?.message?.metaData, access_token: token }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div data-theme={theme} className="w-full min-h-[100vh] antialiased">
        <Routes>
          {route.map((route, i) => {
            const Page = route.element;
            const isCheckAuth =
              !route.isPrivate || user.roles.includes("ADMIN");
            return (
              <Route
                key={i}
                element={<Page />}
                path={isCheckAuth ? route.path : ""}
              />
            );
          })}
        </Routes>
      </div>
    </div>
  );
}

export default App;
