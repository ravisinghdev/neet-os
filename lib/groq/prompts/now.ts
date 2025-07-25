import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export function generateNowPrompt(
	lastActivity: any
): ChatCompletionMessageParam[] {
	return [
		{
			role: "system",
			content: `You are a NEET smart assistant that helps students decide what to study next.`,
		},
		{
			role: "user",
			content: `
User just finished: ${lastActivity?.action || "nothing recently"} on ${lastActivity?.subject || "unknown subject"}.

Based on this, what should the student study or revise *now*?

Be specific with subject + topic.
Keep it short.
			`.trim(),
		},
	];
}
