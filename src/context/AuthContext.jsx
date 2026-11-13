import { useState, createContext, useEffect } from "react";
import api from "../api/api.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
     const [user, setUser] = useState("");
     const [userName, setUserName] = useState(() => localStorage.getItem("userName") ?? "");
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
          const token = localStorage.getItem("token");
          const refreshToken = localStorage.getItem("refreshToken");
          const savedUserName = localStorage.getItem("userName") ?? "";

          if (token && refreshToken) {
               setUser(savedUserName);
               setUserName(savedUserName);
               setIsLoggedIn(true);
          }

          setIsLoading(false);
     }, []);

     const login = async (email, password) => {
          const { data } = await api.post("/api/auth/login", { email, password });

          if (
               typeof data.token !== "string" || !data.token.trim() ||
               typeof data.refreshToken !== "string" || !data.refreshToken.trim() ||
               typeof data.userData?.username !== "string"
          ) {
               throw new Error("The server returned incomplete login data.");
          }

          localStorage.setItem("token", data.token);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("userName", data.userData.username);

          setUser(data.userData.username);
          setUserName(data.userData.username);
          setIsLoggedIn(true);
     };

     const logout = () => {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userName");

          setUser("");
          setUserName("");
          setIsLoggedIn(false);
     };

     if (isLoading) {
          return <p role="status">Restoring session...</p>;
     }

     return (
          <AuthContext.Provider value={{ user, setUser, userName, setUserName, isLoggedIn, setIsLoggedIn, login, logout }}>
               {children}
          </AuthContext.Provider>
     );
};


