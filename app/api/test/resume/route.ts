import { NextResponse } from "next/server";
import { getOngoingTest } from "@/lib/test/onGoingTest";
import { getUser } from "@/lib/user/getUser";

export async function GET() {
	try {
		const user = await getUser();
		if (!user)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const test = await getOngoingTest(user.id);
		if (!test)
			return NextResponse.json(
				{ message: "No ongoing test found" },
				{ status: 404 }
			);

		return NextResponse.json(test);
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
