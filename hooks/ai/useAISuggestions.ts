import { useState } from "react";
import axios from "axios";

export function useAISuggestions() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [suggestions, setSuggestions] = useState<string | null>(null);

	const fetchSuggestions = async (userId: string) => {
		setLoading(true);
		setError(null);
		setSuggestions(null);
		try {
			const res = await axios.post("/api/ai/suggest", { userId });
			setSuggestions(res.data.suggestions || "No suggestions.");
		} catch (err: any) {
			setError(err.response?.data?.error || "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	return { suggestions, loading, error, fetchSuggestions };
}
