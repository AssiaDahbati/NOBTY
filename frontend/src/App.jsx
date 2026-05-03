import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import ChatWidget from "./components/ChatWidget";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import { useAuthModal } from "./context/AuthModalContext";
import "./App.css";

export default function App() {
  const location = useLocation();
  const { authMode, closeAuth } = useAuthModal();

  const hideNavbar = ["/admin", "/dashboard", "/account"].some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!hideNavbar && <Navbar />}

      <AppRoutes />

      {!hideNavbar && <ChatWidget />}

      {authMode === "login" && <Login onClose={closeAuth} />}
      {authMode === "register" && <Register onClose={closeAuth} />}
    </>
  );
}