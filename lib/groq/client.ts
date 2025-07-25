import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export interface GroqAIParams {
	messages: ChatCompletionMessageParam[];
	model?: "llama3-8b-8192" | "llama3-70b-8192" | "gemma-7b-it";
}

export async function queryGroqAI({
	messages,
	model = "llama3-8b-8192",
}: GroqAIParams): Promise<string> {
	const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.GROQCLOUD_API_KEY!}`,
		},
		body: JSON.stringify({ model, messages }),
	});

	const data = await res.json();
	return data?.choices?.[0]?.message?.content ?? "No response.";
}
