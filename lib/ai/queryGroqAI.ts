import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export type SupportedGroqModel =
	| "llama3-8b-8192"
	| "llama3-70b-8192"
	| "gemma-7b-it";

export interface QueryGroqAIParams {
	messages: ChatCompletionMessageParam[];
	model?: SupportedGroqModel;
	temperature?: number;
	top_p?: number;
	max_tokens?: number;
}

interface GroqAIResponse {
	choices?: { message: { content: string } }[];
	error?: {
		message?: string;
	};
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function queryGroqAI({
	messages,
	model = "llama3-8b-8192",
	temperature = 0.7,
	top_p = 1,
	max_tokens = 2048,
}: QueryGroqAIParams): Promise<string> {
	const API_KEY = process.env.GROQCLOUD_API_KEY;

	if (!API_KEY) {
		throw new Error(
			"❌ GROQCLOUD_API_KEY is not defined in environment variables."
		);
	}

	try {
		const response = await fetch(GROQ_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${API_KEY}`,
			},
			body: JSON.stringify({
				model,
				messages,
				temperature,
				top_p,
				max_tokens,
			}),
		});

		const data: GroqAIResponse = await response.json();

		if (!response.ok) {
			const errorMessage =
				data?.error?.message ||
				`Groq request failed with status ${response.status}`;
			throw new Error(errorMessage);
		}

		const content = data.choices?.[0]?.message?.content?.trim();

		return content || "❌ Groq returned empty response.";
	} catch (err: unknown) {
		const error = err instanceof Error ? err.message : "Unknown Groq failure";
		console.error("🔥 Groq AI Error:", error);
		return `❌ Error: ${error}`;
	}
}
