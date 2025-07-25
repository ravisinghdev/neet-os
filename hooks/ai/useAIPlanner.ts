import { useState } from "react";
import axios from "axios";

interface UseAIPlannerOptions {
	userId: string;
	goals?: string[];
}

export function useAIPlanner() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [plan, setPlan] = useState<string | null>(null);

	const fetchPlan = async ({ userId, goals }: UseAIPlannerOptions) => {
		setLoading(true);
		setError(null);
		setPlan(null);

		try {
			const res = await axios.post("/api/ai/plan", {
				userId,
				goals,
			});
			setPlan(res.data.plan || "No plan generated.");
		} catch (err: any) {
			console.error("🔥 AI Planner Error:", err);
			setError(err.response?.data?.error || "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	return { plan, loading, error, fetchPlan };
}
