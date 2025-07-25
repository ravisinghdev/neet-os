import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function getAllTests() {
	const supabase = createServerComponentClient({ cookies });

	const { data, error } = await supabase
		.from("tests")
		.select("id, name, description, category, created_at")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching tests:", error.message);
		throw new Error("Failed to load tests. Please try again.");
	}

	return data || [];
}
