import { useState } from "react";
import axios from "axios";

export function useAIAnalyzer() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [analysis, setAnalysis] = useState<string | null>(null);

	const fetchAnalysis = async (userId: string) => {
		setLoading(true);
		setError(null);
		setAnalysis(null);
		try {
			const res = await axios.post("/api/ai/analyze", { userId });
			setAnalysis(res.data.analysis || "No analysis.");
		} catch (err: any) {
			setError(err.response?.data?.error || "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	return { analysis, loading, error, fetchAnalysis };
}
