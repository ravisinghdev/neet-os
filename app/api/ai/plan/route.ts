import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { queryGroqAI } from "@/lib/ai/queryGroqAI";
import { createClient } from "@/lib/supabase/server";
import { generatePlannerPrompt } from "@/lib/groq/prompts/planner";

// ✅ Zod validation
const PlanRequestSchema = z.object({
	userId: z.string(),
	goals: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
	try {
		const supabase = await createClient();
		const body = await req.json();
		const parsed = PlanRequestSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid request body" },
				{ status: 400 }
			);
		}

		const { userId, goals } = parsed.data;

		// ✅ Fetch user data
		const { data: user, error: userErr } = await supabase
			.from("users")
			.select("*")
			.eq("id", userId)
			.single();

		if (userErr || !user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Optional: fetch additional data (e.g., test_results, activity)
		const systemPrompt = "You're an AI NEET study coach.";
		const messages = generatePlannerPrompt(user, goals);

		const plan = await queryGroqAI({ messages, model: "llama3-70b-8192" });

		return NextResponse.json({ plan }, { status: 200 });
	} catch (err) {
		console.error("🔥 AI Plan Error:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
