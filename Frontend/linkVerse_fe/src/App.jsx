import { useSelector } from "react-redux";
import { Routes, Route, useLocation } from "react-router-dom";
import { route } from "./routes";

function App() {
  const { theme } = useSelector((state) => state.theme);
  const user = useSelector((state) => state.user);
  const location = useLocation();

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
