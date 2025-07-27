"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/server";
import { CalendarDays, Flame, Award } from "lucide-react";
import { motion } from "framer-motion";

interface DayStatus {
	date: string;
	done: boolean;
}

export default function StreakCalendarPage() {
	const [days, setDays] = useState<DayStatus[]>([]);
	const [currentStreak, setCurrentStreak] = useState(0);
	const [longestStreak, setLongestStreak] = useState(0);
	const supabase = createClient();

	useEffect(() => {
		(async () => {
			const { data: userRes } = await supabase.auth.getUser();
			const userId = userRes?.user?.id;
			if (!userId) return;

			const { data } = await supabase
				.from("user_activity")
				.select("timestamp, contributes_to_streak")
				.eq("user_id", userId)
				.eq("contributes_to_streak", true)
				.order("timestamp", { ascending: false })
				.limit(365);

			if (!data) return;

			const uniqueDays = Array.from(
				new Map(data.map((d) => [d.timestamp.slice(0, 10), true])).entries()
			).map(([date, done]) => ({ date, done }));

			setDays(uniqueDays);
			calculateStreaks(uniqueDays);
		})();
	}, []);

	function calculateStreaks(loggedDays: DayStatus[]) {
		let longest = 0;
		let current = 0;
		let streak = 0;

		for (let i = 0; i < 365; i++) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			const iso = date.toISOString().slice(0, 10);
			const isDone = loggedDays.some((d) => d.date === iso);

			if (isDone) {
				streak += 1;
				if (i === 0) current += 1;
			} else {
				if (i === 0) current = 0;
				longest = Math.max(longest, streak);
				streak = 0;
			}
		}
		longest = Math.max(longest, streak);
		setCurrentStreak(current);
		setLongestStreak(longest);
	}

	return (
		<div className="max-w-3xl mx-auto px-6 py-10">
			<h1 className="text-2xl font-bold flex items-center gap-3 mb-6 text-primary">
				<CalendarDays className="w-6 h-6" />
				90‑Day Activity Streak
			</h1>

			<div className="mb-6 grid grid-cols-2 gap-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="bg-gradient-to-br from-green-500/80 to-green-600/90 text-white rounded-xl p-4 flex items-center justify-between shadow-md"
				>
					<div>
						<div className="text-sm">🔥 Current Streak</div>
						<div className="text-3xl font-bold">{currentStreak} days</div>
					</div>
					<Flame className="w-10 h-10" />
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="bg-gradient-to-br from-yellow-400/90 to-orange-500/90 text-white rounded-xl p-4 flex items-center justify-between shadow-md"
				>
					<div>
						<div className="text-sm">🏆 Longest Streak</div>
						<div className="text-3xl font-bold">{longestStreak} days</div>
					</div>
					<Award className="w-10 h-10" />
				</motion.div>
			</div>

			<div className="grid grid-cols-7 gap-[6px]">
				{Array.from({ length: 90 }).map((_, i) => {
					const date = new Date();
					date.setDate(date.getDate() - i);
					const iso = date.toISOString().slice(0, 10);
					const isDone = days.find((d) => d.date === iso);

					const intensity = isDone ? Math.min(currentStreak, 5) : 0;
					const bg =
						intensity === 0
							? "bg-muted"
							: `bg-green-${Math.min(100 + intensity * 100, 600)}`;

					return (
						<motion.div
							key={iso}
							title={`${iso} ${isDone ? "✅ Active" : "❌ Inactive"}`}
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ delay: i * 0.005 }}
							className={`w-6 h-6 rounded-md border ${
								isDone ? "bg-green-500" : "bg-muted"
							} hover:scale-110 transition-transform duration-200`}
						></motion.div>
					);
				})}
			</div>

			<p className="text-xs mt-4 text-muted-foreground">
				🟩 = You were active on that day
			</p>
		</div>
	);
}
