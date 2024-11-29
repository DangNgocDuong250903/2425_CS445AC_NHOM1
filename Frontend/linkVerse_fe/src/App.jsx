import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation } from "react-router-dom";
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
    let token = localStorage.getItem("access_token");
    if (token && isJsonString(token)) {
      token = JSON.parse(token);
      const decoded = jwtDecode(token);
      if (decoded?.userId) {
        handleGetDetailUser(decoded?.userId, token);
      }
    }
  }, []);

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
            const isCheckAuth = !route.isPrivate || user.isAdmin;
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
