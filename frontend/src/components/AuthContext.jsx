import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();

	const login = (email) => {
		console.log("email", email);
		// Save in localstorage
		localStorage.setItem("token", email);
	};

	const logout = () => {
		localStorage.removeItem("token");
		navigate("/login");
		navigate(0);
	};

	useEffect(() => {
		const user = localStorage.getItem("token");
		if (user) {
			login(user);
		}
	}, []);

	const isLoggedIn = () => {
		return localStorage.getItem("token");
	};

	const getEmail = () => {
		return localStorage.getItem("token");
	};

	const value = useMemo(() => ({ login, logout, isLoggedIn, getEmail }), []);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
