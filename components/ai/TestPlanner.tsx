"use client";

import { useAIPlanner } from "@/hooks/ai/useAIPlanner";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";

export default function TestPlanner() {
	const [userId, setUserId] = useState<string | null>(null);
	const { plan, loading, error, fetchPlan } = useAIPlanner();

	useEffect(() => {
		(async () => {
			const { data } = await supabase.auth.getUser();
			const id = data?.user?.user_metadata?.id;
			if (id) setUserId(id);
		})();
	}, []);

	const handleGenerate = async () => {
		if (userId) {
			await fetchPlan({
				userId,
				goals: ["Score 650+ in NEET 2026", "Improve Physics revision"],
			});
		}
	};

	return (
		<div className="p-4 space-y-4">
			<h2 className="text-xl font-bold">🧠 AI Study Plan Debugger</h2>
			<button
				onClick={handleGenerate}
				className="bg-blue-600 text-white px-4 py-2 rounded"
				disabled={loading || !userId}
			>
				{loading ? "Generating..." : "Generate AI Plan"}
			</button>

			{error && <div className="text-red-500 mt-2">❌ {error}</div>}

			{plan && (
				<div className="mt-4 p-4 border rounded  whitespace-pre-wrap">
					{plan}
				</div>
			)}
		</div>
	);
}
