import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { queryGroqAI } from "@/lib/ai/queryGroqAI";
import { generateMotivationPrompt } from "@/lib/groq/prompts/motivation";

const schema = z.object({
	mood: z.string().optional(), // e.g. "frustrated", "tired", "motivated"
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const parsed = schema.safeParse(body);
		if (!parsed.success)
			return NextResponse.json({ error: "Invalid input" }, { status: 400 });

		const { mood } = parsed.data;

		const messages = generateMotivationPrompt(mood);
		const motivation = await queryGroqAI({ messages });

		return NextResponse.json({ motivation });
	} catch (err) {
		console.error("🔥 Motivation Error:", err);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
