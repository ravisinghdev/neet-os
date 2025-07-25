import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export function generatePlannerPrompt(
	user: any,
	goals?: string[]
): ChatCompletionMessageParam[] {
	return [
		{
			role: "system",
			content: `You are an expert NEET preparation mentor. Your task is to create a smart, adaptive 7-day study plan based on the user's goals, strengths, and weaknesses.`,
		},
		{
			role: "user",
			content: `
User Info:
- Name: ${user.name || "Anonymous"}
- Target Exam: NEET
- Current Class: ${user.class || "Not specified"}
- Strengths: ${user.strengths || "Unknown"}
- Weaknesses: ${user.weaknesses || "Unknown"}
- Goals: ${goals?.join(", ") || "Crack NEET with top rank"}

Generate a daily plan with specific subjects, chapters, and revision slots.
`,
		},
	];
}
