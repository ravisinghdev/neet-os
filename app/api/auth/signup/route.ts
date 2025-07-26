import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const reqBody = await req.json();
		const url = new URL(req.url);
		const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
		const cookieStore = cookies();
		const { email, password } = reqBody;

		await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${url.origin}/auth/fallback`,
			},
		});

		return NextResponse.redirect(url);
	} catch (error: any) {
		return NextResponse.json(
			{ message: "Sign Up failed", error: error.message },
			{ status: 501 }
		);
	}
}
