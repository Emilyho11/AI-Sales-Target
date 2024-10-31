import React, { useEffect, useState } from "react";
import { apiInstance, databaseInstance } from '../../axiosConfig';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Card from "../components/Card";
import ClioBg from "../assets/clio-bg.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const getName = async (email) => {
		try {
			const response = await databaseInstance.get("/getUserByEmail", {
				params: {email},
			});
            if (response.data.message === 'User retrieved successfully') {
                return response.data.user.name;
            } else {
                return "";
            }
        } catch (error) {
            console.error("Error getting user:", error);
            return "";
        }
	};

    const handleSubmit = async (event) => {
        setMessage("Logging in...");
        event.preventDefault();
        try {
            const response = await databaseInstance.post("/login", {
                email: email,
                password: password,
            });
            if (response.data.message === "User logged in successfully") {
                setMessage("Login successful");
                const name = await getName(email);
                login(email, name);
                navigate("/");
            } else if (response.data.message === "User not found") {
                setMessage("User not found");
            } else if (response.data.message === "Incorrect password") {
                setMessage("Incorrect password");
            } else {
                setMessage("Failed to login");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setMessage("Error during login");
        }
    };

    return (
        <div className="relative h-screen flex items-center xl:pl-80 p-10 md:p-20">
            <img src={ClioBg} className="absolute inset-0 object-cover w-full h-full z-0" />
            <Card className="w-4/5 md:w-1/2 lg:w-1/3 p-10 xl:py-20 xl:px-24 items-start bg-gray-100 xl:h-3/5">
                <h1 className="pb-6">Login</h1>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col w-full [&>input]:bg-gray-200 [&>input]:px-4 [&>input]:py-4 [&>input]:rounded-md [&>label]:text-left"
                >
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
					<div className="my-4"></div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {message && <p className={`pt-4 message ${message.includes("success") || message.includes("Logging in") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
					<Link className="text-blue-600 text-left hover:text-dark_red hover:underline my-6" to="/signup">
						Don't have an account yet? Sign up here.
					</Link>
                    <button
                        type="submit"
                        className="w-1/2 flex items-center justify-center mt-6 text-white bg-clio_color hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-full text-md px-5 py-2.5 mb-2"
                        >
                        Login
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default Login;
