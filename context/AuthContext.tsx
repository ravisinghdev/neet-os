"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";

type AuthContextType = {
	user: any;
	loading: boolean;
	isLoggedIn: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			// Get the current session
			const { data: sessionData, error } = await supabase.auth.getSession();
			if (error) {
				console.error("Error getting session:", error);
			}
			setUser(sessionData?.session?.user ?? null);
			setLoading(false);

			// Subscribe to auth state changes
			const { data: listener } = supabase.auth.onAuthStateChange(
				(_event, session) => {
					setUser(session?.user ?? null);
					setLoading(false); // ✅ important!
				}
			);

			// Cleanup
			return () => {
				listener.subscription.unsubscribe();
			};
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
