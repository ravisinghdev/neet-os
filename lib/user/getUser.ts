import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { Database } from "@/types/db";
import type { CookieOptions } from "@supabase/ssr";

export async function getUser(): Promise<User | null> {
	const cookieStore = await cookies();

	const supabase = createServerClient<Database>(
		process.env.SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!, // use Service Role Key for server access
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					cookieStore.set({ name, value, ...options });
				},
				remove(name: string, options: CookieOptions) {
					cookieStore.set({ name, value: "", ...options });
				},
			},
		}
	);

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error) {
		console.error("Supabase getUser error:", error.message);
		return null;
	}

	return user;
}
