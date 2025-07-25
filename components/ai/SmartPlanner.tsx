"use client";

import { useEffect, useState } from "react";
import { useAIPlanner } from "@/hooks/ai/useAIPlanner";
import { supabase } from "@/lib/supabase/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function SmartPlanner() {
	const [userId, setUserId] = useState<string | null>(null);
	const { plan, loading, error, fetchPlan } = useAIPlanner();

	useEffect(() => {
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (data?.user?.id) setUserId(data.user.id);
		})();
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="space-y-4"
		>
			<Card className="p-6 border-1 border-gray shadow-xl rounded-2xl">
				<h2 className="text-xl font-bold mb-2">🧠 Smart Study Plan</h2>
				<p className="text-muted-foreground mb-4">
					7-day personalized AI study routine
				</p>
				<Button
					onClick={() => userId && fetchPlan({ userId })}
					disabled={loading}
				>
					{loading ? "Generating..." : "Generate Plan"}
				</Button>

				{error && <p className="text-red-500 mt-3">{error}</p>}

				{plan && (
					<motion.pre
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="mt-4 bg-background p-4 rounded-lg text-sm whitespace-pre-wrap border"
					>
						{plan}
					</motion.pre>
				)}
			</Card>
		</motion.div>
	);
}
