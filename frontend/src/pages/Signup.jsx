import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import { Link, useNavigate } from "react-router-dom";
import { apiInstance, databaseInstance } from '../../axiosConfig';
import ClioBg from "../assets/clio-bg.png";

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
		<div className="relative h-screen flex items-center xl:pl-80 p-10 md:p-20">
            <img src={ClioBg} className="absolute inset-0 object-cover w-full h-full z-0" />
            <Card className="w-4/5 md:w-1/2 lg:w-1/3 p-10 xl:py-20 xl:px-24 items-start bg-gray-100 xl:h-3/5">
				<h1 className="pb-6">Signup</h1>

				<form
					onSubmit={handleCreate}
					className="flex flex-col w-full [&>input]:bg-gray-200 [&>input]:px-4 [&>input]:py-4 [&>input]:rounded-md [&>label]:text-left"
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
					<button type="submit" className="w-1/2 flex items-center justify-center mt-6 text-white bg-clio_color hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-full text-md px-5 py-2.5 mb-2">
						Signup{" "}
					</button>
				</form>
			</Card>
		</div>
	);
};

export default Signup;
