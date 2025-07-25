import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { queryGroqAI } from "@/lib/ai/queryGroqAI";
import { createClient } from "@/lib/supabase/server";
import { generateSuggestionPrompt } from "@/lib/groq/prompts/suggest";

const schema = z.object({
	userId: z.string(),
});

export async function POST(req: NextRequest) {
	try {
		const supabase = await createClient();
		const body = await req.json();
		const parsed = schema.safeParse(body);
		if (!parsed.success)
			return NextResponse.json({ error: "Invalid input" }, { status: 400 });

		const { userId } = parsed.data;

		const { data: testResults } = await supabase
			.from("test_results")
			.select("*")
			.eq("user_id", userId)
			.order("created_at", { ascending: false })
			.limit(10);

		const messages = generateSuggestionPrompt(testResults || []);
		const suggestions = await queryGroqAI({ messages });

		return NextResponse.json({ suggestions });
	} catch (err) {
		console.error("🔥 Suggest Error:", err);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
