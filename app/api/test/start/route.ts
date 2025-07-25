import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
	const supabase = await createClient();
	const { searchParams } = new URL(req.url);
	const testId = searchParams.get("id");

	if (!testId) {
		return NextResponse.json({ error: "Test ID is required" }, { status: 400 });
	}

	try {
		// Get test data
		const { data: test, error: testError } = await supabase
			.from("tests")
			.select("*")
			.eq("id", testId)
			.single();

		if (testError || !test) {
			return NextResponse.json({ error: "Test not found" }, { status: 404 });
		}

		// Get all questions for this test
		const { data: questions, error: questionError } = await supabase
			.from("questions")
			.select("*")
			.eq("test_id", testId);

		if (questionError) {
			return NextResponse.json(
				{ error: "Failed to fetch questions" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ test, questions }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json(
			{ error: "Server error", message: error.message },
			{ status: 500 }
		);
	}
}
