import { useSelector } from "react-redux";
import { Routes, Route, useLocation, Outlet, Navigate } from "react-router-dom";
import { route2, route1, route3 } from "./routes";
import NotFound from "./pages/NotFoundPage";
import Sidebar from "./components/Admin/Sidebar";
import { TopBar } from "./components";
import { Admin } from "./pages";

const Layout = () => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  return user?.token ? (
    <div>
      <Outlet />
    </div>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div>
      <div data-theme={theme} className="w-full min-h-[100vh] antialiased">
        <Routes>
          <Route element={<Layout />}>
            {route1.map((route, i) => {
              const Page = route.element;
              return <Route key={i} element={<Page />} path={route.path} />;
            })}
          </Route>

          {route2.map((route, i) => {
            const Page = route.element;
            return <Route key={i} element={<Page />} path={route.path} />;
          })}

          <Route element={<Admin />}>
            {route3.map((route, i) => {
              const Page = route.element;
              return <Route key={i} element={<Page />} path={route.path} />;
            })}
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
