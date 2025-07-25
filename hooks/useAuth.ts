import { api } from "@/utils/axios";

export const signUp = async (email: string, password: string) => {
	const res = await api.post("/auth/signup", { email, password });
	return res.data;
};

export const signIn = async (email: string, password: string) => {
	const res = await api.post("/auth/signin", { email, password });
	return res.data;
};

export const signOut = async () => {
	const res = await api.post("/auth/signout");
	return res.data;
};

export const getUser = async () => {
	const res = await api.get("/auth/user");
	return res.data;
};
