import { NextRequest, NextResponse } from "next/server";
import { submitTestAttempt } from "@/lib/test/attemptService";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { attemptId, answers } = body;

		if (!attemptId || !answers) {
			return NextResponse.json(
				{ error: "Missing attemptId or answers" },
				{ status: 400 }
			);
		}

		const result = await submitTestAttempt(attemptId, answers);
		if (!result) {
			return NextResponse.json({ error: "Submission failed" }, { status: 500 });
		}

		return NextResponse.json(result);
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
