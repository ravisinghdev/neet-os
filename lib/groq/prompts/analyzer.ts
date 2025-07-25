import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export function generateAnalysisPrompt(
	testResults: any[]
): ChatCompletionMessageParam[] {
	const summary = testResults
		.map(
			(r, i) =>
				`Test ${i + 1}: ${r.subject} - Score: ${r.score}, Accuracy: ${r.accuracy || "N/A"}%`
		)
		.join("\n");

	return [
		{
			role: "system",
			content: `You're a performance analyst for NEET exam prep.`,
		},
		{
			role: "user",
			content: `
Analyze the student's last few test attempts:

${summary}

Instructions:
- Identify strongest and weakest subjects
- Provide a short analysis (2-3 lines)
- End with a recommendation to improve weak areas
			`.trim(),
		},
	];
}
