"use client";

import { useEffect, useState } from "react";
import { useAIAnalyzer } from "@/hooks/ai/useAIAnalyzer";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ProgressInsights() {
	const [userId, setUserId] = useState<string | null>(null);
	const { analysis, loading, error, fetchAnalysis } = useAIAnalyzer();
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
			<Card className="p-6 border-1 border-gray shadow-xl rounded-2xl h-max">
				<h2 className="text-xl font-bold mb-2">📈 Progress Insights</h2>
				<p className="text-muted-foreground mb-4">
					Understand strengths and weaknesses
				</p>
				<Button
					onClick={() => userId && fetchAnalysis(userId)}
					disabled={loading}
				>
					{loading ? "Analyzing..." : "Run Analyzer"}
				</Button>

				{error && <p className="text-red-500 mt-3">{error}</p>}

				{analysis && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="mt-4 p-4 bg-background border rounded-lg whitespace-pre-wrap text-sm"
					>
						{analysis}
					</motion.div>
				)}
			</Card>
		</motion.div>
	);
}
