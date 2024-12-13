import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { route } from "./routes";
import { useEffect } from "react";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserService from "~/services/UserService";
import { updateUser } from "./redux/Slices/userSlice";
import { ProtectedRoute } from "./components";
import {
  ForgotPasswordpage,
  FriendPage,
  HomePage,
  LoginPage,
  RegisterPage,
  ResetPassword,
} from "./pages";

function App() {
  const { theme } = useSelector((state) => state.theme);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const { decoded, token } = handleDecoded();
    if (decoded?.ProfileID) {
      handleGetDetailUser(decoded?.ProfileID, token);
    }
  }, []);

  const handleDecoded = () => {
    let token = localStorage.getItem("token");
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
        const { decoded, token } = handleDecoded();
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        if (decoded?.exp - currentTimeInSeconds <= 1000) {
          const data = await UserService.handleRefreshToken(token);
          config.headers["Authorization"] = `Bearer ${data?.result?.token}`;
          localStorage.setItem("token", JSON.stringify(data?.result?.token));
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
      dispatch(updateUser({ ...res?.result, token }));
    } catch (error) {
      console.log(error);
    }
  };

  //protected route
  const isLoggedIn = !!user?.token;

  return (
    // <div>
    //   <div data-theme={theme} className="w-full min-h-[100vh] antialiased">
    //     <Routes>
    //       {route.map((route, i) => {
    //         const Page = route.element;
    //         const isCheckAuth =
    //           !route.isPrivate || user.roles.includes("ADMIN");
    //         return (
    //           <Route
    //             key={i}
    //             element={<Page />}
    //             path={isCheckAuth ? route.path : ""}
    //           />
    //         );
    //       })}
    //     </Routes>
    //   </div>
    // </div>
    <div>
      <div data-theme={theme} className="w-full min-h-[100vh] antialiased">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordpage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/friend/:id" element={<FriendPage />} />
          <Route path="/" element={<HomePage />} />
          {route.map((route, i) => {
            const Page = route.element;
            return (
              <Route
                key={i}
                path={route.path}
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Page />
                  </ProtectedRoute>
                }
              />
            );
          })}
        </Routes>
      </div>
    </div>
  );
}

export default App;
