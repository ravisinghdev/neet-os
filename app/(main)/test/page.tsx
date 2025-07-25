"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LandingTestRedirect() {
	const router = useRouter();

	useEffect(() => {
		(async () => {
			const { user } = useAuth();

			if (user) {
				router.push("/dashboard/test"); // Redirect logged-in users to test dashboard
			} else {
				router.push("/login"); // Or your auth page
			}
		})();
	}, []);

	return null;
}
