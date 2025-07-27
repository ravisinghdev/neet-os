import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

type TestAttempt = Database["public"]["Tables"]["test_attempts"]["Row"];
type NewTestAttempt = Database["public"]["Tables"]["test_attempts"]["Insert"];
type UpdateTestAttempt =
	Database["public"]["Tables"]["test_attempts"]["Update"];

const supabase = createClient();

// 1. Start a new test attempt
export async function startTestAttempt(data: NewTestAttempt) {
	const { data: attempt, error } = await supabase
		.from("test_attempts")
		.insert([data])
		.select()
		.single();

	if (error) throw new Error(error.message);
	return attempt;
}

// 2. Get a test attempt by ID
export async function getTestAttemptById(id: string) {
	const { data, error } = await supabase
		.from("test_attempts")
		.select("*")
		.eq("id", id)
		.single();

	if (error) throw new Error(error.message);
	return data;
}

// 3. Update a test attempt (score, answers, submitted_at)
export async function getActiveAttempt(
	testId: string,
	userId: string
): Promise<TestAttempt | null> {
	const { data, error } = await supabase
		.from("test_attempts")
		.select("*")
		.eq("test_id", testId)
		.eq("user_id", userId)
		.eq("status", "in_progress")
		.single();

	if (error) return null;
	return data;
}

export async function createTestAttempt(
	testId: string,
	userId: string
): Promise<TestAttempt | null> {
	const { data, error } = await supabase
		.from("test_attempts")
		.insert({
			test_id: testId,
			user_id: userId,
			started_at: new Date().toISOString(),
			status: "in_progress",
		})
		.select()
		.single();

	if (error) {
		console.error("Error creating test attempt:", error.message);
		return null;
	}

	return data;
}

// Also export if already defined elsewhere:
export async function updateTestAttempt(
	attemptId: string,
	updates: Partial<TestAttempt>
) {
	return supabase
		.from("test_attempts")
		.update(updates)
		.eq("id", attemptId)
		.select()
		.single();
}

// 4. Get all attempts by user
export async function getTestAttemptsByUser(user_id: string) {
	const { data, error } = await supabase
		.from("test_attempts")
		.select("*")
		.eq("user_id", user_id)
		.order("started_at", { ascending: false });

	if (error) throw new Error(error.message);
	return data;
}

export async function submitTestAttempt(
	attemptId: string,
	answers: Record<string, number>
): Promise<{ score: number } | null> {
	const { data: attempt } = await supabase
		.from("test_attempts")
		.select("test_id")
		.eq("id", attemptId)
		.single();

	if (!attempt) return null;

	const { data: questions } = await supabase
		.from("questions")
		.select("id, correct_option")
		.eq("test_id", attempt.test_id);

	if (!questions) return null;

	let score = 0;
	for (const q of questions) {
		const selected = answers[q.id];
		if (selected === q.correct_option) score++;
	}

	const { error } = await supabase
		.from("test_attempts")
		.update({
			submitted_at: new Date().toISOString(),
			status: "completed",
			answers,
			score,
		})
		.eq("id", attemptId);

	if (error) return null;
	return { score };
}
