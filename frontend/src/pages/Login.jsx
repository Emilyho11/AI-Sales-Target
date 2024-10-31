import React, { useEffect, useState } from "react";
import { apiInstance, databaseInstance } from '../../axiosConfig';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Card from "../components/Card";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

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
                login(email);
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
        <div className="relative w-full h-screen flex items-center justify-center">
            <Card className="relative z-10 w-4/5 md:w-1/2 lg:w-1/3 xl:w-1/4 px-14 flex flex-col bg-gray-100 py-24 md:py-16">
                <h1>Login</h1>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col w-full [&>input]:bg-gray-200 [&>input]:px-2 [&>input]:py-2 [&>input]:rounded-sm [&>label]:text-left"
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
                    <button type="submit" className="w-1/2 mx-auto flex items-center justify-center mt-6">
                        Login
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default Login;
