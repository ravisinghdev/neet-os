import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export function generateMotivationPrompt(
	mood?: string
): ChatCompletionMessageParam[] {
	return [
		{
			role: "system",
			content: `You are a motivational speaker who helps NEET aspirants stay focused.`,
		},
		{
			role: "user",
			content: `
Current mood: ${mood || "unmotivated"}

Give 1 short, powerful motivational message (1-2 lines max) that uplifts and energizes the student.
No generic advice. Make it feel real and intense.
			`.trim(),
		},
	];
}
