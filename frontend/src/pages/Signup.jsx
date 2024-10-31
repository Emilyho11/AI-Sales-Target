import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import { Link, useNavigate } from "react-router-dom";
import { apiInstance, databaseInstance } from '../../axiosConfig';

const Signup = () => {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const handleCreate = async (event) => {
		event.preventDefault();
		const user = {
			name: name,
			email: email,
			password: password
		}

		try {
			const response = await databaseInstance.post("/addUser", {
				user: user,
			});
			if (response.data.message === "User inserted successfully") {
				setMessage("Account created successfully");
				alert("Account created successfully");
				navigate("/login");
			} else if (response.data.message === "User already exists") {
				setMessage("Account already exists. Please login.");
			} else {
				setMessage("Failed to create account");
			}
		} catch (error) {
			console.error("Error during signup:", error);
			console.log("HEHEH:", user);
			setMessage("Error during signup");
		}
	};

	return (
		<div className="relative w-full h-screen flex items-center justify-center">
			<Card className="relative z-10 w-4/5 md:w-1/2 lg:w-1/3 xl:w-1/4 px-14 flex flex-col bg-gray-100 py-24 md:py-16">
				<h1>Signup</h1>

				<form
					onSubmit={handleCreate}
					className="flex flex-col  w-full [&>input]:bg-gray-200 [&>input]:px-2 [&>input]:py-2 [&>input]:rounded-sm [&>label]:text-left"
				>
					<label htmlFor="fullName">Full Name:</label>
					<input
						type="text"
						id="name"
						name="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
					<br className="my-2" />
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<br className="my-2" />
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					{message && <p className={`pt-4 message ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
					<Link className="text-blue-600 text-left hover:text-dark_red hover:underline my-6" to="/login">
						Have an account? Sign in here.
					</Link>
					<button type="submit" className="w-1/2 mx-auto flex items-center justify-center mt-6">
						Signup{" "}
					</button>
				</form>
			</Card>
		</div>
	);
};

export default Signup;
