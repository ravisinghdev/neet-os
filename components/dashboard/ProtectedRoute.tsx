"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import Spinner from "@/components/ui/spinner";

export default function ProtectedRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, loading, isLoggedIn } = useAuth();
	const router = useRouter();
	console.log("Is Logged In:", isLoggedIn);

	useEffect(() => {
		if (loading || user === undefined) return;

		if (!user) {
			router.replace("/auth/login");
		}
	}, [loading, user]);

	if (loading) {
		// Or your branded loading animation/spinner
		return (
			<div className="text-center mt-20">
				<Spinner />
			</div>
		);
	}

	return <>{children}</>;
}
