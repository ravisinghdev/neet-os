import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export function generateSuggestionPrompt(
	testResults: any[]
): ChatCompletionMessageParam[] {
	const summary = testResults
		.map(
			(result, i) =>
				`Test ${i + 1} — ${result.subject || "N/A"}: Score ${result.score || "N/A"}, Weak Areas: ${result.weak_topics || "N/A"}`
		)
		.join("\n");

	return [
		{
			role: "system",
			content: `You are a NEET preparation mentor. Based on past performance, suggest chapters/topics that need improvement.`,
		},
		{
			role: "user",
			content: `
Here are the student's last test results:
${summary}

Instructions:
- Recommend 3-5 important topics to focus on
- Mention the subject and topic clearly
- Keep the response short and actionable
			`.trim(),
		},
	];
}
