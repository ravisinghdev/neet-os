"use client";

import { MessageCircle, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function HelpFeedbackPage() {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [type, setType] = useState("bug");
	const [screenshot, setScreenshot] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSend = async () => {
		if (!message) return toast.error("Please describe your issue or idea.");
		setLoading(true);

		const formData = new FormData();
		formData.append("email", email);
		formData.append("message", message);
		formData.append("type", type);
		if (screenshot) formData.append("screenshot", screenshot);

		await fetch("/api/tools/help-feedback", {
			method: "POST",
			body: formData,
		});

		toast.success("Thanks for your feedback!");
		setLoading(false);
		setMessage("");
		setEmail("");
		setScreenshot(null);
	};

	return (
		<div className="p-8 max-w-3xl mx-auto space-y-6">
			<h2 className="text-3xl font-bold flex items-center gap-2">
				<MessageCircle /> Help & Feedback
			</h2>

			<Card>
				<CardContent className="space-y-4 p-6">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label>Email (optional)</Label>
							<Input
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<Label>Category</Label>
							<select
								className="w-full border rounded px-3 py-2"
								value={type}
								onChange={(e) => setType(e.target.value)}
							>
								<option value="bug">🐞 Bug Report</option>
								<option value="feature">🌟 Feature Request</option>
								<option value="help">❓ Need Help</option>
								<option value="suggestion">💡 Suggestion</option>
							</select>
						</div>
					</div>

					<div>
						<Label>Description</Label>
						<Textarea
							placeholder="Describe your issue or suggestion in detail..."
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="min-h-[150px]"
						/>
					</div>

					<div>
						<Label>Attach Screenshot (optional)</Label>
						<Input
							type="file"
							accept="image/*"
							onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
						/>
					</div>

					<Button
						onClick={handleSend}
						disabled={loading}
						className="w-full text-lg"
					>
						{loading ? (
							<Loader2 className="animate-spin mr-2" />
						) : (
							<Mail className="mr-2" />
						)}
						{loading ? "Sending..." : "Send Feedback"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
