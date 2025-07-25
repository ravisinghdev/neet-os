import { supabase } from "@/lib/supabase/supabase";
import { logUserActivity } from "./user/userLogger";

interface RewardInput {
	userId: string;
	correct: number;
	mode: "daily" | "custom";
	resultId: string;
}

export async function handleTestRewards({
	userId,
	correct,
	mode,
	resultId,
}: RewardInput) {
	const xpFromCorrect = correct * 2;
	const bonusXP = mode === "daily" ? 20 : 5;
	const totalXP = xpFromCorrect + bonusXP;

	const contributesToStreak = mode === "daily";

	// ✅ Update XP in profile
	await supabase.rpc("increment_user_xp", {
		uid: userId,
		xp: totalXP,
	});

	// ✅ If daily, update streak (or create logic)
	if (contributesToStreak) {
		await supabase.rpc("increment_user_streak", { uid: userId });
	}

	// ✅ Check if badges unlocked
	const badgeEvents = await checkAndUnlockBadges(userId);

	// ✅ Log XP Reward
	await logUserActivity({
		user_id: userId,
		event_type: "xp_earned",
		module: "test",
		target_type: "test",
		related_id: resultId,
		metadata: { amount: totalXP, from: "test_submission" },
		xp_earned: totalXP,
		contributes_to_streak: contributesToStreak,
		progress: 100,
	});

	return {
		xp: totalXP,
		badgesUnlocked: badgeEvents,
	};
}

async function checkAndUnlockBadges(userId: string): Promise<string[]> {
	const unlocked: string[] = [];

	// Example badge: First Test Badge
	const { count: testsTakenCount } = await supabase
		.from("test_results")
		.select("id", { count: "exact", head: true })
		.eq("user_id", userId);

	if ((testsTakenCount ?? 0) >= 1) {
		const { data: existing } = await supabase
			.from("user_badges")
			.select("*")
			.eq("user_id", userId)
			.eq("badge_key", "first_test");

		if (!existing?.length) {
			await supabase.from("user_badges").insert({
				user_id: userId,
				badge_key: "first_test",
				awarded_at: new Date().toISOString(),
			});

			// Log to activity
			await logUserActivity({
				user_id: userId,
				event_type: "badge_unlocked",
				module: "rewards",
				target_type: "badge",
				related_id: null,
				metadata: { badge_key: "first_test" },
				xp_earned: 0,
			});

			unlocked.push("first_test");
		}
	}

	// TODO: Add more badge unlocks here...

	return unlocked;
}
