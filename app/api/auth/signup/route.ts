// ✅ Correct for App Router (app/api/auth/signup/route.ts)
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { email, password } = body;

		const supabase = createClient(); // No need for await if it's a sync factory

		const { data, error } = await (
			await supabase
		).auth.signUp({ email, password });

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json(
			{ message: "Signup successful", data },
			{ status: 200 }
		);
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
