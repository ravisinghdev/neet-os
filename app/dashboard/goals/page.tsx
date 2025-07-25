"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { Progress } from "@/components/ui/progress";
import { Target, CalendarDays, CheckCircle2, Clock10 } from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";

interface Goal {
	id: string;
	title: string;
	progress: number;
	deadline: string;
}

export default function GoalTrackerPage() {
	const [goals, setGoals] = useState<Goal[]>([]);

	useEffect(() => {
		(async () => {
			const { data: userRes } = await supabase.auth.getUser();
			const userId = userRes?.user?.id;
			if (!userId) return;

			const { data } = await supabase
				.from("goals")
				.select("*")
				.eq("user_id", userId)
				.order("created_at", { ascending: true });

			if (data) setGoals(data);
		})();
	}, []);

	return (
		<div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
			<h1 className="text-2xl font-bold flex items-center gap-3 text-primary mb-4">
				<Target className="w-6 h-6" />
				Your Goals
			</h1>

			{goals.length === 0 && (
				<p className="text-muted-foreground">No goals added yet.</p>
			)}

			{goals.map((goal, index) => {
				const now = dayjs();
				const due = dayjs(goal.deadline);
				const isOverdue = now.isAfter(due) && goal.progress < 100;
				const isCompleted = goal.progress >= 100;

				const status = isCompleted
					? "Completed"
					: isOverdue
						? "Overdue"
						: "In Progress";

				const statusColor = isCompleted
					? "text-green-600"
					: isOverdue
						? "text-red-500"
						: "text-yellow-600";

				const remaining = isCompleted
					? "🎉 Done"
					: isOverdue
						? `❌ Overdue by ${now.diff(due, "day")}d`
						: `${due.diff(now, "day")}d left`;

				return (
					<motion.div
						key={goal.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05 }}
						className="rounded-xl bg-white/10 backdrop-blur-md border border-muted p-5 space-y-3 shadow-sm"
					>
						<div className="flex justify-between items-start">
							<div>
								<p className="font-semibold text-base">{goal.title}</p>
								<p className={`text-sm mt-1 ${statusColor}`}>{status}</p>
							</div>

							<div className="text-xs text-muted-foreground flex items-center gap-1">
								<CalendarDays className="w-4 h-4" />
								{goal.deadline}
							</div>
						</div>

						<Progress
							value={goal.progress}
							className={`transition-all ${
								isCompleted
									? "bg-green-500"
									: isOverdue
										? "bg-red-500"
										: "bg-yellow-500"
							}`}
						/>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>{goal.progress}% complete</span>
							<span>{remaining}</span>
						</div>
					</motion.div>
				);
			})}
		</div>
	);
}
