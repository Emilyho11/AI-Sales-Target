import React, { useEffect } from "react";
import { useAuth } from "../components/AuthContext";
const Logout = () => {
	const { logout } = useAuth();
	useEffect(() => {
		logout();
		// Refresh and redirect to login is handled in both AuthContext and NavBar
	}, []);

	return <div>Logging out...</div>;
};

export default Logout;
