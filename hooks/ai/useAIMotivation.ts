import { useState } from "react";
import axios from "axios";

export function useAIMotivation() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [motivation, setMotivation] = useState<string | null>(null);

	const fetchMotivation = async (mood?: string) => {
		setLoading(true);
		setError(null);
		setMotivation(null);
		try {
			const res = await axios.post("/api/ai/motivation", { mood });
			setMotivation(res.data.motivation || "No motivation available.");
		} catch (err: any) {
			setError(err.response?.data?.error || "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	return { motivation, loading, error, fetchMotivation };
}
