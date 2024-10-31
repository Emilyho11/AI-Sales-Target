import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const login = (email, name) => {
    console.log("email", email, "name", name);
    // Save in localstorage
    localStorage.setItem("token", email);
    localStorage.setItem("name", name);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login");
    navigate(0);
  };

  useEffect(() => {
    const user = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    if (user && name) {
      login(user, name);
    }
  }, []);

  const isLoggedIn = () => {
    return localStorage.getItem("token");
  };

  const getEmail = () => {
    return localStorage.getItem("token");
  };

  const getName = () => {
    return localStorage.getItem("name");
  };

  const value = useMemo(() => ({ login, logout, isLoggedIn, getEmail, getName }), []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
