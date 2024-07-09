import { useContext, createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  const getSessionCookie = () => {
    return Cookies.get("session");
  };

  const getUserRole = () => {
    return Cookies.get("role");
  };

  const getUserId = () => {
    return Cookies.get("userId");
  };

  const checkAuth = () => {
    const cookie = getSessionCookie();
    setAuthenticated(!!cookie);
  };

  const login = (token, role, userId) => {
    Cookies.set("session", token);
    Cookies.set("role", role);
    Cookies.set("userId", userId);
    setAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("session");
    Cookies.remove("role");
    Cookies.remove("userId");
    setAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        getSessionCookie,
        login,
        logout,
        getUserRole,
        getUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
