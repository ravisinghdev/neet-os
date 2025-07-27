import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
	const supabase = createClient();

	const {
		data: { user },
		error,
	} = await (await supabase).auth.getUser();

	if (error || !user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	return NextResponse.json({ user }, { status: 200 });
}
