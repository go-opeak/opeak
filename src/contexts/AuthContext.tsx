import { authState } from "@states/authAtoms";
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useRecoilState } from "recoil";

type AuthContextProps = {
  isAuthenticated: boolean;
  login: (token: string, userId: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useRecoilState(authState);

  useEffect(() => {
    const token = localStorage.getItem("TOKEN");
    setIsAuthenticated(!!token);
  }, []);

  const login = (token: string, userId: string) => {
    localStorage.setItem("TOKEN", token);
    localStorage.setItem("USER_ID", userId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("USER_ID");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
