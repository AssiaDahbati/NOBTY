import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const [authMode, setAuthMode] = useState(null);

  const openLogin = () => setAuthMode("login");
  const openRegister = () => setAuthMode("register");
  const closeAuth = () => setAuthMode(null);

  return (
    <AuthModalContext.Provider
      value={{ authMode, setAuthMode, openLogin, openRegister, closeAuth }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);

  if (!context) {
    throw new Error("useAuthModal must be used inside AuthModalProvider");
  }

  return context;
}