"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import {
	Flame,
	RefreshCcw,
	CircleCheck,
	Brain,
	BarChart3,
	Trophy,
	Clock,
	Calendar,
} from "lucide-react";

interface Challenge {
	id: string;
	date: string;
	question_ids: string[];
	completed: boolean;
	score: number | null;
}

export default function DailyChallengePage() {
	const router = useRouter();
	const [challenge, setChallenge] = useState<Challenge | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [streak, setStreak] = useState<number>(0);
	const [regenerating, setRegenerating] = useState(false);
	const supabase = createClient();

	const today = new Date().toISOString().slice(0, 10);

	useEffect(() => {
		const fetchChallenge = async () => {
			const userResp = await supabase.auth.getUser();
			const user = userResp.data.user;
			if (!user) return;

			setUserId(user.id);

			// 1. Check today's challenge
			const { data: existing } = await supabase
				.from("daily_challenges")
				.select("*")
				.eq("user_id", user.id)
				.eq("date", today)
				.maybeSingle();

			if (existing) {
				setChallenge(existing);
			} else {
				await createChallenge(user.id);
			}

			// 2. Calculate streak
			const { data: allChallenges } = await supabase
				.from("daily_challenges")
				.select("completed, date")
				.eq("user_id", user.id);

			const streakCount = allChallenges?.filter((c) => c.completed).length ?? 0;
			setStreak(streakCount);

			setLoading(false);
		};

		fetchChallenge();
	}, []);

	const createChallenge = async (uid: string) => {
		setLoading(true);
		const { data: allQuestions } = await supabase
			.from("questions")
			.select("id");

		if (!allQuestions || allQuestions.length < 5) {
			setError("Not enough questions to create a challenge.");
			setLoading(false);
			return;
		}

		const selected = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 7);

		const ids = selected.map((q) => q.id);

		const { data: newChallenge, error: insertError } = await supabase
			.from("daily_challenges")
			.insert({
				user_id: uid,
				date: today,
				question_ids: ids,
				completed: false,
			})
			.select()
			.single();

		if (insertError) {
			setError("Failed to create challenge.");
		} else {
			setChallenge(newChallenge);
		}
		setLoading(false);
	};

	const handleStart = () => {
		router.push(`/dashboard/practice/test/start?mode=daily&date=${today}`);
	};

	const handleRegenerate = async () => {
		if (!userId) return;
		setRegenerating(true);

		// Delete existing (only if not completed)
		await supabase
			.from("daily_challenges")
			.delete()
			.eq("user_id", userId)
			.eq("date", today)
			.eq("completed", false);

		await createChallenge(userId);
		setRegenerating(false);
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
					🧪 Daily Challenge
				</h1>
				<Button
					variant="outline"
					className="text-sm rounded-lg"
					onClick={handleRegenerate}
					disabled={challenge?.completed || regenerating}
				>
					<RefreshCcw className="w-4 h-4 mr-2" />
					{regenerating ? "Regenerating..." : "Regenerate"}
				</Button>
			</div>

			{/* Main Card */}
			<Card className="rounded-2xl">
				<CardContent className="p-6 space-y-4">
					{loading ? (
						<>
							<Skeleton className="h-6 w-2/3" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-1/2" />
						</>
					) : error ? (
						<p className="text-sm text-red-600">{error}</p>
					) : challenge ? (
						<>
							<div className="flex justify-between items-center text-sm">
								<span className="text-muted-foreground flex items-center gap-1">
									<Calendar className="w-4 h-4" />
									{today}
								</span>

								{challenge.completed ? (
									<span className="text-green-600 font-semibold flex items-center gap-1">
										<CircleCheck className="w-4 h-4" /> Completed
									</span>
								) : (
									<span className="text-yellow-500 font-semibold flex items-center gap-1">
										<Clock className="w-4 h-4" /> Not attempted
									</span>
								)}
							</div>

							<p className="text-muted-foreground text-sm">
								Today’s challenge contains{" "}
								<strong>{challenge.question_ids.length}</strong> questions. Mix
								of Physics, Chemistry & Biology selected randomly to train your
								speed and accuracy.
							</p>

							{!challenge.completed && (
								<Button onClick={handleStart} className="mt-2 w-full">
									Start Now 🚀
								</Button>
							)}

							{challenge.completed && challenge.score !== null && (
								<p className="text-sm text-muted-foreground">
									🏁 Your Score: <strong>{challenge.score}</strong> /{" "}
									{challenge.question_ids.length}
								</p>
							)}
						</>
					) : (
						<p>No challenge found.</p>
					)}
				</CardContent>
			</Card>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="rounded-xl p-4">
					<CardHeader className="flex items-center gap-2 text-sm font-medium">
						<Flame className="w-4 h-4" /> Streak
					</CardHeader>
					<CardContent>
						<p className="text-orange-500 font-semibold">{streak} day streak</p>
						<p className="text-xs text-muted-foreground mt-1">
							Keep going daily to grow your NEET challenge streak.
						</p>
					</CardContent>
				</Card>

				<Card className="rounded-xl p-4">
					<CardHeader className="flex items-center gap-2 text-sm font-medium">
						<Brain className="w-4 h-4" /> Accuracy
					</CardHeader>
					<CardContent>
						<p className="text-green-600 font-semibold">
							{challenge && challenge.score !== null
								? Math.round(
										(challenge.score / challenge.question_ids.length) * 100
									)
								: "--"}
							%
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							Based on your last challenge.
						</p>
					</CardContent>
				</Card>

				<Card className="rounded-xl p-4">
					<CardHeader className="flex items-center gap-2 text-sm font-medium">
						<Trophy className="w-4 h-4" /> Rewards
					</CardHeader>
					<CardContent>
						<p className="text-yellow-600 font-semibold">+50 XP</p>
						<p className="text-xs text-muted-foreground mt-1">
							Complete challenges to earn XP and unlock rewards.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
