"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, BrainCircuit, FileSearch } from "lucide-react";
import { motion } from "framer-motion";

export default function AIAssistPage() {
	const [query, setQuery] = useState("");
	const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(false);

	const handleAsk = async () => {
		if (!query.trim()) return;
		setLoading(true);
		setResponse("");

		try {
			const res = await fetch("/api/ai/assistant", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt: query }),
			});
			const data = await res.json();
			setResponse(data.reply);
		} catch (err) {
			setResponse("⚠️ Failed to get AI response.");
		} finally {
			setLoading(false);
		}
	};

	const tools = [
		{
			icon: <Sparkles className="w-5 h-5" />,
			title: "Explain Topic",
			prompt: "Explain [Topic] in simple terms",
		},
		{
			icon: <FileSearch className="w-5 h-5" />,
			title: "Generate Quiz",
			prompt: "Create 5 MCQs for [Topic]",
		},
		{
			icon: <BrainCircuit className="w-5 h-5" />,
			title: "Make a Revision Plan",
			prompt: "Create a 3-day revision plan for Physics",
		},
	];

	return (
		<div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-center"
			>
				<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex justify-center items-center gap-3">
					<BrainCircuit className="w-7 h-7 text-yellow-500" />
					AI Assist
				</h1>
				<p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mt-2">
					Get instant AI help with your studies — from concept explanations to
					revision planning.
				</p>
			</motion.div>

			<div className="flex flex-col md:flex-row gap-4 justify-center items-center">
				<Input
					placeholder="Ask me anything..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="w-full md:w-[500px]"
				/>
				<Button
					onClick={handleAsk}
					disabled={loading}
					className="whitespace-nowrap"
				>
					{loading ? "Thinking..." : "Ask AI"}
				</Button>
			</div>

			{response && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.4 }}
					className="text-center border border-muted rounded-xl px-6 py-4 text-sm md:text-base text-muted-foreground whitespace-pre-wrap"
				>
					{response}
				</motion.div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6">
				{tools.map((tool, i) => (
					<motion.div
						whileHover={{ scale: 1.03 }}
						transition={{ type: "spring", stiffness: 300 }}
						key={i}
						onClick={() => setQuery(tool.prompt)}
						className="flex flex-col gap-1 p-4 border border-muted rounded-xl cursor-pointer hover:border-yellow-400 transition"
					>
						<div className="flex items-center gap-2 font-semibold text-yellow-600">
							{tool.icon}
							{tool.title}
						</div>
						<p className="text-xs text-muted-foreground">{tool.prompt}</p>
					</motion.div>
				))}
			</div>
		</div>
	);
}
