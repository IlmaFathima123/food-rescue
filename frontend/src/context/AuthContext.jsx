import { createContext, useContext, useEffect, useState } from "react";
import * as api from "../lib/api";

const AuthContext = createContext(null);
const STORAGE_KEY_USER = "foodrescue_auth_user";

function getStoredCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getStoredCurrentUser);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  const login = async (email, password) => {
    const user = await api.loginUser(email.trim().toLowerCase(), password);
    setCurrentUser(user);
    return user;
  };

  const register = async (userData) => {
    const user = await api.registerUser(userData);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isDonor: currentUser?.role === "donor",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
