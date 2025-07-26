import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const reqBody = await req.json();
		const { email, password } = reqBody;
		const url = new URL(req.url);
		const cookieStore = cookies();

		const supabase = createRouteHandlerClient({
			cookies: () => cookieStore,
		});

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return NextResponse.json({ message: "Something went wrong" });
		}

		return NextResponse.redirect(url.origin, {
			status: 301,
		});
	} catch (error: any) {
		return NextResponse.json({ message: "Login failed", error: error.message });
	}
}
