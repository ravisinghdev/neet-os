"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase";
import AINowHelper from "@/components/ai/AINowHelper";
import MotivationCard from "@/components/ai/MotivationCard";
import GoalModal from "@/components/dashboard/GoalModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StudyCalendar from "@/components/dashboard/StudyCalendar";
import { Sparkles, Rocket, NotebookPen, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({ accuracy: 0, tests: 0, streak: 0 });
	const [goals, setGoals] = useState<string[]>([]);
	const [goalModalOpen, setGoalModalOpen] = useState(false);

	const { user } = useAuth();
	useEffect(() => {
		async function loadData() {
			// Fetch stats
			const [{ data: tests }, { data: activity }, { data: goalsData }] =
				await Promise.all([
					supabase
						.from("test_results")
						.select("score, accuracy")
						.order("created_at", { ascending: false })
						.limit(30),
					supabase
						.from("user_activity")
						.select("date")
						.order("date", { ascending: false })
						.limit(30),
					supabase.from("goals").select("goal"),
				]);

			const total = tests?.length || 0;
			const avgAcc = total
				? Math.round(
						tests!.reduce((sum, t) => sum + (t.accuracy ?? 0), 0) / total
					)
				: 0;
			const streak = calculateStreak(activity?.map((a) => a.date || "") || []);

			setStats({ accuracy: avgAcc, tests: total, streak });
			setGoals(goalsData?.map((g) => g.goal) || []);
			setLoading(false);
		}

		loadData();
	}, []);

	const calculateStreak = (dates: string[]) => {
		const today = new Date().toDateString();
		const setDates = new Set(dates.map((d) => new Date(d).toDateString()));
		let count = 0,
			day = new Date();
		while (setDates.has(day.toDateString())) {
			count++;
			day.setDate(day.getDate() - 1);
		}
		return count;
	};

	if (loading) return <div className="p-8 text-center">Loading dashboard…</div>;

	return (
		<div className="min-h-screen px-6 py-8 bg-background space-y-12">
			<header className="space-y-1">
				<motion.h1
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="text-3xl font-bold"
				>
					👋 Welcome back, {user?.user_metadata?.full_name}!
				</motion.h1>
				<p className="text-muted-foreground">Let&apos;s make today count.</p>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="p-5 shadow-md">
					<h3 className="text-sm text-muted-foreground">Accuracy</h3>
					<Progress value={stats.accuracy} className="h-2 rounded" />
					<p className="mt-2 text-lg font-semibold">{stats.accuracy}%</p>
				</Card>
				<Card className="p-5 shadow-md">
					<h3 className="text-sm text-muted-foreground">Tests Taken</h3>
					<p className="mt-2 text-3xl font-bold">{stats.tests}</p>
				</Card>
				<Card className="p-5 shadow-md">
					<h3 className="text-sm text-muted-foreground">Current Streak</h3>
					<p className="mt-2 text-3xl font-bold">{stats.streak} days</p>
				</Card>
			</div>

			<StudyCalendar />

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<AINowHelper />
				<MotivationCard />
			</div>

			<Card className="p-6 rounded-xl shadow-lg">
				<h2 className="text-lg font-semibold mb-2">📌 Goals</h2>
				{goals.length ? (
					<div className="flex flex-wrap gap-2">
						{goals.map((g, i) => (
							<span
								key={i}
								className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
							>
								{g}
							</span>
						))}
					</div>
				) : (
					<p className="text-sm text-muted-foreground">No goals set yet.</p>
				)}
			</Card>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
				<Button
					className="flex items-center gap-2"
					onClick={() => router.push("/test/start")}
				>
					<Rocket className="w-4 h-4" /> Start Timed Test
				</Button>

				<Button
					variant="outline"
					className="flex items-center gap-2"
					onClick={() => setGoalModalOpen(true)}
				>
					<NotebookPen className="w-4 h-4" /> Update Goals
				</Button>

				<Button
					variant="ghost"
					className="flex items-center gap-2"
					onClick={() => router.push("/dashboard/progress")}
				>
					<BarChart3 className="w-4 h-4" /> View Progress
				</Button>
			</div>

			<footer className="mt-12 text-center text-xs text-muted-foreground">
				✨ Powered by Groq AI · NEET OS 2025
			</footer>

			<GoalModal open={goalModalOpen} onClose={() => setGoalModalOpen(false)} />
		</div>
	);
}
