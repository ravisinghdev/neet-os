import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { queryGroqAI } from "@/lib/ai/queryGroqAI";
import { createClient } from "@/lib/supabase/server";
import { generateNowPrompt } from "@/lib/groq/prompts/now";

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

		const { data: activity } = await supabase
			.from("user_activity")
			.select("*")
			.eq("user_id", userId)
			.order("timestamp", { ascending: false })
			.limit(1);

		const messages = generateNowPrompt(activity?.[0]);
		const suggestion = await queryGroqAI({ messages });

		return NextResponse.json({ suggestion });
	} catch (err) {
		console.error("🔥 Now Error:", err);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
