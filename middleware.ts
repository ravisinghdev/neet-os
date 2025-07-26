import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "./types/supabase";

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();

	const supabase = createMiddlewareClient<Database>({ req, res });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const pathname = req.nextUrl.pathname;

	// Redirect unauthenticated users away from protected routes
	if (!session && pathname.startsWith("/dashboard")) {
		const loginUrl = new URL("/auth/login", req.url);
		return NextResponse.redirect(loginUrl);
	}

	// Redirect authenticated users away from auth routes
	if (session && pathname.startsWith("/auth")) {
		const dashboardUrl = new URL("/dashboard", req.url);
		return NextResponse.redirect(dashboardUrl);
	}

	return res;
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
