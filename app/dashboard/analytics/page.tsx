"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Percent, ListChecks, BarChart2, Brain } from "lucide-react";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	LineChart,
	Line,
	CartesianGrid,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Radar,
} from "recharts";

type TestResult = {
	score: number;
	total: number;
	subject: string;
	chapter?: string;
	created_at: string;
};

type StudyLog = {
	duration: number;
	chapter: string;
};

export default function AnalyticsPage() {
	const [stats, setStats] = useState<any>(null);
	const [testResults, setTestResults] = useState<TestResult[]>([]);
	const supabase = createClient();

	const [aiInsight, setAiInsight] = useState<string>(
		"Generating AI Insight..."
	);

	useEffect(() => {
		const fetchData = async () => {
			const user = (await supabase.auth.getUser()).data.user;
			if (!user) return;

			const userId = user.id;

			const { data: studyLogsData, error: studyError } = await supabase
				.from("study_logs")
				.select("duration, chapter")
				.eq("user_id", userId)
				.gte("date", new Date(Date.now() - 7 * 86400000).toISOString());

			const studyLogs = studyLogsData ?? [];

			const { data: testResultsData, error: testError } = await supabase
				.from("test_results")
				.select("score, total, subject, chapter, created_at")
				.eq("user_id", userId);

			const testResults = testResultsData ?? []; // fallback to empty array
			setTestResults(testResults);

			// STAT CALCULATIONS
			const totalStudyMinutes = studyLogs.reduce(
				(sum, log) => sum + (log.duration || 0),
				0
			);
			const uniqueChapters = new Set(studyLogs.map((log) => log.chapter));
			const chapterCoverage = (uniqueChapters.size / 97) * 100;

			const totalScore = testResults.reduce((sum, r) => sum + r.score, 0);
			const totalPossible = testResults.reduce((sum, r) => sum + r.total, 0);
			const avgAccuracy =
				totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

			setStats({
				totalStudyMinutes,
				avgAccuracy,
				testCount: testResults.length,
				chapterCoverage,
			});

			generateInsight(testResults, avgAccuracy, totalStudyMinutes);
		};

		fetchData();
	}, []);

	// 🧠 AI Insight Generator
	const generateInsight = (
		results: TestResult[],
		avgAccuracy: number,
		totalStudyMinutes: number
	) => {
		if (results.length < 2) {
			setAiInsight(
				"You're just getting started! Complete more tests to unlock insights."
			);
			return;
		}

		const sorted = results
			.slice()
			.sort(
				(a, b) =>
					new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
			);

		const recent = sorted.slice(-3);
		const prev = sorted.slice(-6, -3);

		const recentAvg =
			recent.reduce((sum, t) => sum + t.score / t.total, 0) / recent.length ||
			0;
		const prevAvg =
			prev.reduce((sum, t) => sum + t.score / t.total, 0) / prev.length || 0;

		const delta = recentAvg - prevAvg;

		const weakSubject = results.reduce((acc: any, r) => {
			acc[r.subject] = acc[r.subject] || { score: 0, total: 0 };
			acc[r.subject].score += r.score;
			acc[r.subject].total += r.total;
			return acc;
		}, {});

		const weak = Object.entries(weakSubject)
			.map(([subject, { score, total }]: any) => ({
				subject,
				accuracy: (score / total) * 100,
			}))
			.sort((a, b) => a.accuracy - b.accuracy)[0];

		let insight = "";

		if (delta > 0.05) {
			insight += `✅ You're improving! Your average score rose by ${(
				delta * 100
			).toFixed(1)}%. Keep it up.\n`;
		} else if (delta < -0.05) {
			insight += `⚠️ Your accuracy dropped by ${Math.abs(delta * 100).toFixed(
				1
			)}%. Time to revise.\n`;
		}

		if (weak.accuracy < 60) {
			insight += `📉 You’re struggling in ${weak.subject}. Focus there for the next few days.\n`;
		}

		if (totalStudyMinutes < 180) {
			insight += `⏱️ You've studied less than 3 hours this week. Try to aim for 6+ hours for consistency.\n`;
		}

		setAiInsight(insight.trim() || "Keep up the consistency. No major alerts!");
	};

	// 📊 Chart Data
	const subjectAccuracyData = testResults.reduce((acc, r) => {
		const existing = acc.find((d) => d.subject === r.subject);
		if (existing) {
			existing.score += r.score;
			existing.total += r.total;
			existing.accuracy = (existing.score / existing.total) * 100;
		} else {
			acc.push({
				subject: r.subject,
				score: r.score,
				total: r.total,
				accuracy: (r.score / r.total) * 100,
			});
		}
		return acc;
	}, [] as any[]);

	const scoreTimelineData = testResults
		.slice()
		.sort(
			(a, b) =>
				new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
		)
		.map((t) => ({
			date: new Date(t.created_at).toLocaleDateString("en-IN", {
				day: "2-digit",
				month: "short",
			}),
			score: Math.round((t.score / t.total) * 100),
		}));

	const chapterRadarData = testResults
		.filter((r) => r.chapter)
		.reduce((acc, r) => {
			const existing = acc.find((d) => d.chapter === r.chapter);
			if (existing) {
				existing.score += r.score;
				existing.total += r.total;
				existing.percent = (existing.score / existing.total) * 100;
			} else {
				acc.push({
					chapter: r.chapter,
					score: r.score,
					total: r.total,
					percent: (r.score / r.total) * 100,
				});
			}
			return acc;
		}, [] as any[]);

	return (
		<div className="px-4 md:px-8 py-6 space-y-6">
			<h1 className="text-2xl font-bold tracking-tight">
				📊 Analytics Dashboard
			</h1>

			{/* 🔷 Stat Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<StatCard
					icon={<Clock size={20} />}
					label="Study Time"
					value={
						stats ? `${(stats.totalStudyMinutes / 60).toFixed(1)}h` : "..."
					}
				/>
				<StatCard
					icon={<Percent size={20} />}
					label="Avg Accuracy"
					value={stats ? `${stats.avgAccuracy.toFixed(1)}%` : "..."}
				/>
				<StatCard
					icon={<ListChecks size={20} />}
					label="Tests Taken"
					value={stats ? `${stats.testCount}` : "..."}
				/>
				<StatCard
					icon={<BarChart2 size={20} />}
					label="Chapter Coverage"
					value={stats ? `${stats.chapterCoverage.toFixed(1)}%` : "..."}
				/>
			</div>

			{/* 📊 Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card className="h-80">
					<CardContent className="p-4">
						<h2 className="text-lg font-semibold mb-2">
							📚 Subject-wise Accuracy
						</h2>
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={subjectAccuracyData}>
								<XAxis dataKey="subject" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="accuracy" fill="#4f46e5" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card className="h-80">
					<CardContent className="p-4">
						<h2 className="text-lg font-semibold mb-2">
							📈 Performance Over Time
						</h2>
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={scoreTimelineData}>
								<XAxis dataKey="date" />
								<YAxis />
								<CartesianGrid stroke="#eee" />
								<Tooltip />
								<Line
									type="monotone"
									dataKey="score"
									stroke="#22c55e"
									strokeWidth={2}
									dot={false}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{chapterRadarData.length > 0 ? (
					<Card className="h-80 lg:col-span-2">
						<CardContent className="p-4">
							<h2 className="text-lg font-semibold mb-2">
								🧠 Chapter Weakness Radar
							</h2>
							<ResponsiveContainer width="100%" height="100%">
								<RadarChart data={chapterRadarData}>
									<PolarGrid />
									<PolarAngleAxis dataKey="chapter" />
									<PolarRadiusAxis angle={30} domain={[0, 100]} />
									<Radar
										name="Score"
										dataKey="percent"
										stroke="#facc15"
										fill="#facc15"
										fillOpacity={0.6}
									/>
									<Tooltip />
								</RadarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				) : (
					<div className="text-sm text-muted-foreground text-center py-4">
						No chapter data available to generate radar chart.
					</div>
				)}
			</div>

			{/* 🧠 AI Insight */}
			<Card className="border-l-4 border-primary shadow-md bg-background/80 backdrop-blur-sm">
				<CardContent className="py-6 px-4 flex items-start gap-4">
					<Brain className="text-primary mt-1" size={24} />
					<div>
						<h3 className="text-lg font-semibold mb-1">AI Insight</h3>
						<p className="text-sm whitespace-pre-line text-muted-foreground">
							{aiInsight}
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function StatCard({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {
	return (
		<Card className="bg-background/70 shadow border border-border backdrop-blur-md">
			<CardContent className="flex items-center justify-between py-4 px-5">
				<div>
					<p className="text-sm text-muted-foreground">{label}</p>
					<p className="text-xl font-bold">{value}</p>
				</div>
				<div className="text-primary">{icon}</div>
			</CardContent>
		</Card>
	);
}
