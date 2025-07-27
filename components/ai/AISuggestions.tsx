"use client";

import { useEffect, useState } from "react";
import { useAISuggestions } from "@/hooks/ai/useAISuggestions";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AISuggestions() {
	const [userId, setUserId] = useState<string | null>(null);
	const { suggestions, loading, error, fetchSuggestions } = useAISuggestions();
	const supabase = createClient();

	useEffect(() => {
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (data?.user?.id) setUserId(data.user.id);
		})();
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="space-y-4"
		>
			<Card className="p-6 border-1 border-gray shadow-xl rounded-2xl">
				<h2 className="text-xl font-bold mb-2">🔍 AI Suggestions</h2>
				<p className="text-muted-foreground mb-4">
					Get topic-wise suggestions to improve
				</p>
				<Button
					onClick={() => userId && fetchSuggestions(userId)}
					disabled={loading}
				>
					{loading ? "Analyzing..." : "Get Suggestions"}
				</Button>

				{error && <p className="text-red-500 mt-3">{error}</p>}

				{suggestions && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="mt-4 p-4 bg-background border rounded-lg whitespace-pre-wrap text-sm"
					>
						{suggestions}
					</motion.div>
				)}
			</Card>
		</motion.div>
	);
}
