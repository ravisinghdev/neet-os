"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/server";

export default function RegisterPage() {
	const router = useRouter();
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const supabase = createClient();

	const handleRegister = async () => {
		try {
			setIsLoading(true);
			setError("");
			const { error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${location.origin}/dashboard`,
					data: {
						full_name: fullName,
					},
				},
			});

			if (error) {
				setError(error.message);
			} else {
				setSubmitted(true);
			}
			toast("Hurrey!!, Account created successfully...", {
				description: "Please check your email to confirm your account.",
			});
		} catch (error: any) {
			console.log("Something went wrong...", error);
			toast("Uh! Something went unexpected...", {
				description: "Please try again with new and correct details",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (submitted) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-muted px-4">
				<Card className="w-full max-w-md border border-border shadow-lg">
					<CardContent className="p-6 space-y-6 text-center">
						<h2 className="text-2xl font-bold">📧 Confirm Your Email</h2>
						<p className="text-muted-foreground">
							A confirmation link has been sent to <strong>{email}</strong>.
							<br />
							Please check your inbox and verify your account.
						</p>
						<Button onClick={() => router.push("/auth/login")}>
							Back to Login
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
			<Card className="w-full max-w-md shadow-xl border border-border">
				<CardContent className="p-6 space-y-6">
					<h2 className="text-2xl font-bold text-center">
						Create Your NEET Account
					</h2>

					<div className="space-y-2">
						<Label htmlFor="fullName">Full Name</Label>
						<Input
							id="fullName"
							placeholder="Ravi Singh"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							placeholder="you@example.com"
							type="email"
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

					{error && <p className="text-sm text-red-500">{error}</p>}

					<Button className="w-full" onClick={handleRegister}>
						{isLoading ? <Spinner /> : "Register"}
					</Button>

					<p className="text-sm text-muted-foreground text-center">
						Already have an account?{" "}
						<a href="/auth/login" className="underline">
							Log in
						</a>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
