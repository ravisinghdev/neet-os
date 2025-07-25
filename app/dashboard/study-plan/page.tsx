"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { useAuth } from "@/context/AuthContext";
import {
	Brain,
	CheckCircle2,
	Flame,
	Sparkles,
	History,
	Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	ResponsiveContainer,
	Tooltip,
} from "recharts";

interface StudyPlanItem {
	id: string;
	day: string;
	topic: string;
	subject: string;
	duration: string;
	ai_tip: string;
	date: string;
	completed: boolean;
	completed_at: string | null;
}

export default function StudyPlanPage() {
	const { user } = useAuth();
	const [plans, setPlans] = useState<StudyPlanItem[]>([]);
	const [subjects, setSubjects] = useState<string[]>([]);
	const [streak, setStreak] = useState(0);
	const [loading, setLoading] = useState(true);
	const [generating, setGenerating] = useState(false);
	const [startDate, setStartDate] = useState(() =>
		new Date().toISOString().slice(0, 10)
	);
	const [showAll, setShowAll] = useState(false);

	const subjectColors: Record<string, string> = {
		Physics: "text-purple-600",
		Chemistry: "text-orange-600",
		Biology: "text-green-600",
	};

	useEffect(() => {
		if (!user) return;
		const loadData = async () => {
			const { data } = await supabase
				.from("users")
				.select("preferred_subjects")
				.eq("user_id", user.id)
				.single();
			setSubjects(
				data?.preferred_subjects || ["Physics", "Chemistry", "Biology"]
			);
			await fetchPlans();
		};
		loadData();
	}, [user]);

	const fetchPlans = async () => {
		setLoading(true);
		let query = supabase
			.from("study_plans")
			.select("*")
			.eq("user_id", user.id)
			.order("date", { ascending: true });

		if (!showAll) {
			query = query.gte("date", new Date().toISOString().split("T")[0]);
		}

		const { data, error } = await query;

		if (!error && data) {
			setPlans(data);
			setStreak(data.filter((p) => p.completed).length);
		}

		setLoading(false);
	};

	const handleRegenerate = async () => {
		setGenerating(true);
		const response = await fetch("/api/ai/plan", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				startDate: new Date(startDate).toISOString(),
				subjects,
			}),
		});
		if (response.ok) await fetchPlans();
		else alert("Failed to regenerate");
		setGenerating(false);
	};

	const markCompleted = async (id: string) => {
		await supabase
			.from("study_plans")
			.update({
				completed: true,
				completed_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.eq("id", id);
		await fetchPlans();
	};

	const subjectSummary = () => {
		const map: Record<string, number> = {};
		plans.forEach((p) => {
			if (!map[p.subject]) map[p.subject] = 0;
			map[p.subject]++;
		});
		return Object.entries(map).map(([name, count]) => ({
			name,
			count,
		}));
	};

	return (
		<div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
				<h1 className="text-3xl font-bold flex items-center gap-2">
					<Brain className="w-6 h-6" />
					Smart Study Plan
				</h1>
				<div className="flex flex-wrap items-center gap-2">
					<input
						type="date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						className="border rounded-md px-3 py-1 text-sm"
					/>
					<Button
						variant="outline"
						size="sm"
						onClick={handleRegenerate}
						disabled={generating}
					>
						{generating ? "Regenerating..." : "Regenerate"}
					</Button>
					<Button
						variant="secondary"
						size="sm"
						onClick={() => setShowAll(!showAll)}
					>
						<Filter className="w-4 h-4 mr-1" />
						{showAll ? "Upcoming Only" : "Show All"}
					</Button>
				</div>
			</div>

			{/* Study Plans */}
			{loading ? (
				<p className="text-sm opacity-70">Loading...</p>
			) : plans.length === 0 ? (
				<p className="text-sm opacity-70">No plans available.</p>
			) : (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{plans.map((item) => (
						<Card
							key={item.id}
							className={`rounded-xl border p-4 relative flex flex-col justify-between min-h-[220px] transition-all hover:shadow ${
								item.completed ? "border-green-400 ring-1 ring-green-300" : ""
							}`}
						>
							<CardContent className="space-y-2 p-0">
								<div className="flex justify-between items-center text-sm">
									<span className="font-medium">{item.day}</span>
									<span className="text-xs text-muted-foreground">
										{format(new Date(item.date), "MMM dd")}
									</span>
								</div>
								<div
									className={`text-sm font-semibold ${
										subjectColors[item.subject] || "text-gray-700"
									}`}
								>
									{item.subject}: {item.topic}
								</div>
								<p className="text-xs text-muted-foreground">
									⏱ Duration: {item.duration}
								</p>
								<Separator />
								<div className="flex gap-2 items-start text-xs">
									<Sparkles className="w-4 h-4 mt-0.5" />
									<span>{item.ai_tip}</span>
								</div>
							</CardContent>
							{!item.completed ? (
								<Button
									size="sm"
									className="mt-4 rounded-md text-xs"
									onClick={() => markCompleted(item.id)}
									variant="secondary"
								>
									<CheckCircle2 className="w-4 h-4 mr-2" />
									Mark Completed
								</Button>
							) : (
								<p className="text-xs text-green-600 mt-4 font-medium">
									✅ Completed
								</p>
							)}
						</Card>
					))}
				</div>
			)}

			{/* Summary */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="rounded-xl p-4">
					<CardContent className="p-0">
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-2 text-sm font-medium">
								<Flame className="w-4 h-4" />
								Streak
							</div>
							<span className="text-sm font-bold text-orange-500">
								🔥 {streak} Days
							</span>
						</div>
						<Separator className="my-2" />
						<p className="text-xs text-muted-foreground">
							Consistency builds habit. Earn streak rewards every week.
						</p>
					</CardContent>
				</Card>

				<Card className="rounded-xl p-4 md:col-span-2">
					<CardHeader className="p-0 mb-2 text-sm font-semibold flex items-center gap-2">
						<History className="w-4 h-4" />
						Weekly Subject Breakdown
					</CardHeader>
					<CardContent className="p-0">
						<ResponsiveContainer width="100%" height={220}>
							<BarChart data={subjectSummary()}>
								<XAxis dataKey="name" />
								<YAxis allowDecimals={false} />
								<Tooltip />
								<Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
