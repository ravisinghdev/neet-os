import { supabase } from "@/lib/supabase/supabase";

interface LogUserActivityProps {
	user_id: string;
	event_type: string;
	module: string;
	target_type?: string | null;
	related_id?: string | null;
	subject?: string | null;
	chapter?: string | null;
	metadata?: Record<string, any>;
	progress?: number | null;
	contributes_to_streak?: boolean;
	xp_earned?: number;
	session_id?: string | null;
	device_type?: string;
	ip_address?: string | null;
	user_agent?: string | null;
	timestamp?: string;
}

export async function logUserActivity({
	user_id,
	event_type,
	module,
	target_type = null,
	related_id = null,
	subject = null,
	chapter = null,
	metadata = {},
	progress = null,
	contributes_to_streak = false,
	xp_earned = 0,
	session_id = null,
	device_type = "web",
	ip_address = null,
	user_agent = null,
	timestamp = new Date().toISOString(),
}: LogUserActivityProps) {
	const { error } = await supabase.from("user_activity").insert({
		user_id,
		event_type,
		module,
		target_type,
		related_id,
		subject,
		chapter,
		metadata,
		progress,
		contributes_to_streak,
		xp_earned,
		session_id,
		device_type,
		ip_address,
		user_agent,
		timestamp,
	});

	if (error) {
		console.error("❌ Failed to log user activity:", error.message);
	}
}
