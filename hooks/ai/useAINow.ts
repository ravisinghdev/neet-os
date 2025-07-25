import { useState } from "react";
import axios from "axios";

export function useAINow() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [suggestion, setSuggestion] = useState<string | null>(null);

	const fetchNow = async (userId: string) => {
		setLoading(true);
		setError(null);
		setSuggestion(null);
		try {
			const res = await axios.post("/api/ai/now", { userId });
			setSuggestion(res.data.suggestion || "No suggestion.");
		} catch (err: any) {
			setError(err.response?.data?.error || "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	return { suggestion, loading, error, fetchNow };
}
