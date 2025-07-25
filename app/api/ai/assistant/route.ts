import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { queryGroqAI } from "@/lib/ai/queryGroqAI";

const schema = z.object({
	messages: z.array(
		z.object({
			role: z.enum(["user", "system", "assistant"]),
			content: z.string(),
		})
	),
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = schema.safeParse(body);
		if (!parsed.success)
			return NextResponse.json({ error: "Invalid input" }, { status: 400 });

		const { messages } = parsed.data;

		const response = await queryGroqAI({
			messages,
			model: "llama3-8b-8192",
		});

		return NextResponse.json({ response });
	} catch (err) {
		console.error("🔥 Assistant Error:", err);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
