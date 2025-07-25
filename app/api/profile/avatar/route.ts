import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
	try {
		const supabase = await createClient();

		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file || file.size === 0) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		const fileExt = file.name.split(".").pop();
		const fileName = `${uuidv4()}.${fileExt}`;

		const { data, error: uploadError } = await supabase.storage
			.from("avatars")
			.upload(fileName, file, {
				cacheControl: "3600",
				upsert: false,
			});

		if (uploadError) {
			console.error("Upload failed:", uploadError.message);
			return NextResponse.json({ error: uploadError.message }, { status: 500 });
		}

		const user = await supabase.auth.getUser();
		const userId = user.data?.user?.id;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await supabase
			.from("profiles")
			.update({
				avatar_url: fileName,
			})
			.eq("id", userId);

		return NextResponse.json({ success: true, path: fileName });
	} catch (err: any) {
		console.error("Server error:", err);
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 }
		);
	}
}
