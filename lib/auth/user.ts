import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";

export async function getUser() {
	const supabase = createServerComponentClient<Database>({ cookies });

	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		throw new Error("Unauthorized");
	}

	return { user: data?.user! };
}
