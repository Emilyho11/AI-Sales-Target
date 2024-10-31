import axios from "axios";

const apiInstance = axios.create({
	baseURL: "http://localhost:3000/api",
	timeout: 1000,
});

const databaseInstance = axios.create({
	baseURL: "http://localhost:3001/api",
	timeout: 1000,
});

export { databaseInstance, apiInstance };
