"use client";

import { useState } from "react";
import { useAIMotivation } from "@/hooks/ai/useAIMotivation";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

export default function MotivationCard() {
	const { motivation, loading, error, fetchMotivation } = useAIMotivation();
	const [mood, setMood] = useState("tired");

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="p-6 border rounded-2xl shadow-xl space-y-4"
		>
			<h2 className="text-xl font-bold">💪 Daily Motivation</h2>
			<p className="text-muted-foreground text-sm">
				Get a quote based on your current mood
			</p>

			{/* <select
				className="w-full border rounded px-3 py-2 text-sm"
				value={mood}
				onChange={(e) => setMood(e.target.value)}
			>
				<option value="tired">Tired</option>
				<option value="frustrated">Frustrated</option>
				<option value="motivated">Motivated</option>
				<option value="bored">Bored</option>
			</select> */}
			<Select onValueChange={(e) => setMood(e)}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Select your mood" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value="frustrated">Frustrated</SelectItem>
						<SelectItem value="motivated">Motivated</SelectItem>
						<SelectItem value="bored">Bored</SelectItem>
						{/* <SelectItem value="grapes">Grapes</SelectItem>
						<SelectItem value="pineapple">Pineapple</SelectItem> */}
					</SelectGroup>
				</SelectContent>
			</Select>

			<Button onClick={() => fetchMotivation(mood)} disabled={loading}>
				{loading ? "Loading..." : "Get Motivation"}
			</Button>

			{error && <div className="text-red-500">{error}</div>}

			{motivation && (
				<motion.blockquote
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="text-lg font-medium mt-4 text-center italic"
				>
					“{motivation}”
				</motion.blockquote>
			)}
		</motion.div>
	);
}
