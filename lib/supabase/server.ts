// lib/supabase/createClient.ts
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase"; // adjust path as needed

export const createClient = () => {
	return createClientComponentClient<Database>();
};
