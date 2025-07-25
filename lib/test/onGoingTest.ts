import { supabase } from "@/lib/supabase/supabase";

export async function getOngoingTest(userId: string) {
	const { data, error } = await supabase
		.from("test_sessions")
		.select("*")
		.eq("user_id", userId)
		.is("submitted_at", null)
		.order("started_at", { ascending: false })
		.limit(1)
		.single();

	if (error) throw new Error(error.message);
	return data;
}
