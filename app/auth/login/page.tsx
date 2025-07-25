"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";

export default function LoginPage() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async () => {
		setIsLoading(true);
		setError(null); // if you’re showing form error text

		// Optional smooth spinner
		await new Promise((resolve) => setTimeout(resolve, 100));

		try {
			const res = await axios.post("/api/auth/signin", {
				email: email.trim(),
				password,
			});

			// Check for API error
			if (res.data?.error) {
				toast.error("Login failed", {
					description: res.data.error || "Invalid email or password.",
					duration: 4000,
				});
				setError(res.data.error); // Optional: show under form input
				return;
			}

			toast.success("Welcome back!", {
				description: "You've been logged in successfully.",
				duration: 2000,
			});

			// Optional: Redirect to attempted route
			const params = new URLSearchParams(window.location.search);
			const redirectedFrom = params.get("redirectedFrom") || "/dashboard";

			setTimeout(() => {
				router.replace(redirectedFrom);
			}, 1500);
		} catch (err: any) {
			console.error("Login error:", err);

			const message =
				err?.response?.data?.message ||
				err?.response?.data?.error ||
				"Something went wrong. Please try again later.";

			toast.error("Unexpected error", {
				description: message,
				duration: 4000,
			});

			setError(message); // Optional UI form error
		} finally {
			setTimeout(() => {
				setIsLoading(false);
			}, 1500);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
			<Card className="w-full max-w-md shadow-xl border border-border">
				<CardContent className="p-6 space-y-6">
					<h2 className="text-2xl font-bold text-center">Welcome Back</h2>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<Button className="w-full" onClick={handleLogin} disabled={isLoading}>
						{isLoading ? <Spinner /> : "Log In"}
					</Button>

					<p className="text-sm text-muted-foreground text-center">
						Don&#39;t have an account?{" "}
						<Link href="/auth/signup" className="underline">
							Sign up
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
