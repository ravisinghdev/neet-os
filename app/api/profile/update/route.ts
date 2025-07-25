import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/user";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
	const supabase = await createClient();
	const user = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const formData = await req.formData();

	const updates: { [key: string]: any } = {
		id: user.data.user?.id,
		name: formData.get("name"),
		age: formData.get("age"),
		gender: formData.get("gender"),
		location: formData.get("location"),
	};

	// Remove undefined/null
	Object.keys(updates).forEach((key) => {
		if (updates[key] === "null" || updates[key] === "undefined") {
			delete updates[key];
		}
	});

	// ✅ Handle Avatar Upload (if exists)
	const avatarFile = formData.get("avatar") as File | null;
	let avatarUrl = null;

	if (avatarFile && avatarFile.size > 0) {
		const buffer = Buffer.from(await avatarFile.arrayBuffer());
		const filePath = `avatars/${user.data.user?.id}/${uuid()}`;

		const { data, error } = await supabase.storage
			.from("avatars")
			.upload(filePath, buffer, {
				contentType: avatarFile.type,
				upsert: true,
			});

		if (error) {
			console.error("Avatar Upload Failed:", error.message);
			return NextResponse.json(
				{ error: "Failed to upload avatar" },
				{ status: 500 }
			);
		}

		const { data: publicUrl } = supabase.storage
			.from("avatars")
			.getPublicUrl(filePath);

		avatarUrl = publicUrl?.publicUrl;
		updates.avatar_url = avatarUrl;
	}

	// ✅ Update profile in DB
	const { error: updateError } = await supabase
		.from("profiles")
		.update(updates)
		.eq("id", user.data.user?.id);

	if (updateError) {
		return NextResponse.json({ error: updateError.message }, { status: 500 });
	}

	return NextResponse.json({ success: true, avatarUrl });
}
