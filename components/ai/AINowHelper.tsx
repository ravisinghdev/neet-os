"use client";

import { useEffect, useState } from "react";
import { useAINow } from "@/hooks/ai/useAINow";
import { supabase } from "@/lib/supabase/supabase";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AINowHelper() {
	const [userId, setUserId] = useState<string | null>(null);
	const { suggestion, loading, error, fetchNow } = useAINow();

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
			className="p-6 rounded-xl shadow-lg space-y-3 "
		>
			<div className="text-lg font-semibold">⏱️ What To Study Now?</div>
			<Button onClick={() => userId && fetchNow(userId)} disabled={loading}>
				{loading ? "Thinking..." : "Ask AI"}
			</Button>

			{error && <div className="text-red-500">{error}</div>}
			{suggestion && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="text-sm bg-background border mt-3 p-3 rounded-lg"
				>
					{suggestion}
				</motion.div>
			)}
		</motion.div>
	);
}
