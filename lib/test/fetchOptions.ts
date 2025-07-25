import { supabase } from "../supabase/supabase";

// Fetch all distinct subjects from chapters table
export const getAllSubjects = async (): Promise<string[]> => {
	const { data, error } = await supabase.from("chapters").select("subject");

	if (error) {
		console.error("Error fetching subjects:", error.message);
		return [];
	}

	// Extract unique subjects
	const uniqueSubjects = Array.from(new Set(data.map((item) => item.subject)));
	return uniqueSubjects;
};

// Fetch chapters based on selected subject
export const getChaptersBySubject = async (
	subject: string
): Promise<string[]> => {
	const { data, error } = await supabase
		.from("chapters")
		.select("name")
		.eq("subject", subject)
		.eq("class", "11")
		.order("name", { ascending: true });

	if (error) {
		console.error(
			`Error fetching chapters for subject ${subject}:`,
			error.message
		);
		return [];
	}

	return data.map((item) => item.name);
};
