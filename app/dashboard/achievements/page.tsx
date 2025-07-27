"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/server";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface Achievement {
	id: string;
	title: string;
	description: string;
	unlocked: boolean;
	unlocked_at: string | null;
	category?: string;
	icon?: string; // Optional icon like 🧠 or 🔥
}

export default function AchievementsPage() {
	const [achievements, setAchievements] = useState<Achievement[]>([]);
	const supabase = createClient();

	useEffect(() => {
		(async () => {
			const { data: userRes } = await supabase.auth.getUser();
			const userId = userRes?.user?.id;
			if (!userId) return;

			const { data } = await supabase
				.from("achievements")
				.select("*")
				.eq("user_id", userId)
				.order("unlocked_at", { ascending: true });

			if (data) setAchievements(data);
		})();
	}, []);

	return (
		<div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
			<h1 className="text-2xl font-bold flex items-center gap-3 text-primary">
				<Trophy className="w-6 h-6" />
				Achievements
			</h1>

			{achievements.length === 0 && (
				<p className="text-muted-foreground">No achievements unlocked yet.</p>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{achievements.map((a, i) => {
					const isUnlocked = a.unlocked;
					const unlockedDate = a.unlocked_at
						? new Date(a.unlocked_at).toLocaleDateString()
						: null;

					return (
						<motion.div
							key={a.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.05 }}
							className={`rounded-xl p-4 border shadow-sm relative group overflow-hidden transition ${
								isUnlocked
									? "bg-gradient-to-br from-green-100 to-green-200 border-green-400"
									: "bg-muted text-muted-foreground opacity-70"
							}`}
						>
							{a.icon && (
								<div className="absolute top-2 right-2 text-2xl">{a.icon}</div>
							)}

							<div className="flex justify-between items-start mb-1">
								<span className="font-semibold text-base">{a.title}</span>
								{isUnlocked && unlockedDate && (
									<span className="text-xs opacity-60">{unlockedDate}</span>
								)}
							</div>

							<p className="text-sm mb-2">{a.description}</p>

							{a.category && (
								<span className="inline-block text-xs rounded-full px-2 py-1 bg-gray-100 text-gray-700 mt-1">
									{a.category}
								</span>
							)}

							{!isUnlocked && (
								<div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] hidden group-hover:flex items-center justify-center text-xs font-semibold">
									🔒 Locked
								</div>
							)}
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
