"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/server";

type AuthContextType = {
	user: any;
	loading: boolean;
	isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const supabase = createClient();

	useEffect(() => {
		const initAuth = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) {
				console.log("No active session. User may not be logged in.");
			}

			setUser(session?.user);
			console.log(session?.user);
		};

		initAuth();
	}, []);

	const isLoggedIn = !!user;

	return (
		<AuthContext.Provider value={{ user, loading, isLoggedIn }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
};
