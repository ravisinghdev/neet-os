import axios from "axios";

export const api = axios.create({
	baseURL: "/api", // Local API routes
});
