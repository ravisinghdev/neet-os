"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/server";
import { Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface AISuggestion {
	id: string;
	content: string;
	created_at: string;
	type?: string; // Optional category tag like 'Tip', 'Warning'
	rank?: number; // Optional priority score
}

export default function AISuggestionsPage() {
	const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
	const [loading, setLoading] = useState(false);
	const supabase = createClient();

	const fetchSuggestions = async () => {
		setLoading(true);
		const { data: userRes } = await supabase.auth.getUser();
		const userId = userRes?.user?.id;
		if (!userId) return;

		const { data } = await supabase
			.from("ai_suggestions")
			.select("*")
			.eq("user_id", userId)
			.order("created_at", { ascending: false });

		if (data) setSuggestions(data);
		setLoading(false);
	};

	useEffect(() => {
		fetchSuggestions();
	}, []);

	return (
		<div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold flex items-center gap-3 text-primary">
					<Sparkles className="w-6 h-6" />
					AI Suggestions
				</h1>
				<button
					onClick={fetchSuggestions}
					disabled={loading}
					className="flex items-center gap-2 text-sm border px-3 py-1 rounded-md hover:bg-muted transition"
				>
					<RefreshCw className="w-4 h-4" />
					{loading ? "Refreshing..." : "Refresh"}
				</button>
			</div>

			{suggestions.length === 0 && (
				<p className="text-muted-foreground text-sm">No AI suggestions yet.</p>
			)}

			<ul className="space-y-4">
				{suggestions.map((s, i) => (
					<motion.li
						key={s.id}
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.05 }}
						className="p-4 rounded-xl border shadow-sm bg-white/10 backdrop-blur-md"
					>
						<div className="flex items-start justify-between gap-3">
							<div className="flex-1 space-y-1">
								<p className="text-sm leading-snug">{s.content}</p>
								<div className="text-xs text-muted-foreground mt-1 flex gap-2">
									{dayjs(s.created_at).fromNow()}
									{s.type && (
										<span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
											{s.type}
										</span>
									)}
									{s.rank && s.rank >= 8 && (
										<span className="text-red-500 font-semibold">🔥 Hot</span>
									)}
								</div>
							</div>
						</div>
					</motion.li>
				))}
			</ul>
		</div>
	);
}
