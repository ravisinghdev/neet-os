import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const url = new URL(req.url);
		const code = String(url.searchParams.get("code"));

		if (!code) {
			const cookieStore = cookies();
			const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

			await supabase.auth.exchangeCodeForSession(code);
		}

		return NextResponse.redirect(url.origin);
	} catch (error: any) {
		return NextResponse.json(
			{ message: "Fallback failed", error: error.message },
			{ status: 501 }
		);
	}
}
