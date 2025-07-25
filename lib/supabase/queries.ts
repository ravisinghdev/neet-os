import { createClient } from "@/lib/supabase/server";

const supabase = createClient();

export async function getSubjects() {
	const { data, error } = await (await supabase).from("subjects").select("*");
	if (error) throw new Error(error.message);
	return data;
}

export async function getChaptersBySubject(subjectId: string) {
	const { data, error } = await (await supabase)
		.from("chapters")
		.select("*")
		.eq("subject_id", subjectId);

	if (error) throw new Error(error.message);
	return data;
}
