import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
	const body = await req.json();
	const { email, password } = body;

	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(JSON.stringify({ message: "Login successful", data }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
