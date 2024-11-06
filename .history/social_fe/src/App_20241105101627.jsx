import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  Home,
  Profile,
  Register,
  Login,
  ResetPassword,
  NotFound,
} from "./pages";
import { useSelector } from "react-redux";

const Layout = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />

        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
