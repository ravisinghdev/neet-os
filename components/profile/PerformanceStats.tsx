"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { CardContainer } from "@/components/ui/CardContainer";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, BarChart3, Flame } from "lucide-react";

export function PerformanceStats() {
	const { profile, loading } = useUserProfile();

	if (loading) {
		return (
			<CardContainer>
				<p className="text-sm text-muted-foreground">Loading performance...</p>
			</CardContainer>
		);
	}
	if (!profile) return null;

	const { tests_taken = 0, avg_score = 0, streak = 0 } = profile;

	return (
		<CardContainer>
			<h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
				📊 Performance Stats
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
				<StatBox
					title="Tests Taken"
					value={tests_taken}
					icon={<BarChart3 size={20} />}
				/>
				<StatBox
					title="Avg Score"
					value={avg_score}
					suffix="%"
					icon={<Sparkles size={20} />}
				/>
				<StatBox
					title="Streak 🔥"
					value={streak}
					icon={<Flame size={20} color="#f97316" />}
				/>
			</div>
		</CardContainer>
	);
}

function StatBox({
	title,
	value,
	suffix = "",
	icon,
}: {
	title: string;
	value: number;
	suffix?: string;
	icon: React.ReactNode;
}) {
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		let start = 0;
		const end = value;
		if (start === end) return;

		const increment = end / 30;
		const duration = 1000;
		const stepTime = duration / 30;

		const timer = setInterval(() => {
			start += increment;
			if (start >= end) {
				start = end;
				clearInterval(timer);
			}
			setDisplayValue(Math.round(start));
		}, stepTime);

		return () => clearInterval(timer);
	}, [value]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="rounded-2xl border border-border shadow-md px-6 py-5 backdrop-blur-lg bg-white/5 hover:scale-[1.02] transition-all"
		>
			<div className="flex justify-center items-center gap-2 mb-1 text-primary">
				{icon}
				<span className="text-lg font-bold">{displayValue + suffix}</span>
			</div>
			<p className="text-xs text-muted-foreground tracking-wide">{title}</p>
		</motion.div>
	);
}
