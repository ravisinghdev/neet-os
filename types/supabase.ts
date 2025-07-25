export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[];

export type Database = {
	public: {
		Tables: {
			questions: {
				Row: {
					id: number;
					question: string;
					options: string[];
					correct_answer: string;
					subject: string;
					chapter: string;
					difficulty: string;
				};
				Insert: {
					id?: number;
					question: string;
					options: string[];
					correct_answer: string;
					subject: string;
					chapter: string;
					difficulty: string;
				};
				Update: Partial<Database["public"]["Tables"]["questions"]["Insert"]>;
			};

			test_sessions: {
				Row: {
					id: string;
					user_id: string;
					mode: "daily" | "timed" | "custom";
					question_ids: number[];
					score: number | null;
					started_at: string;
					submitted_at: string | null;
					responses: Json;
					created_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					mode: "daily" | "timed" | "custom";
					question_ids: number[];
					score?: number | null;
					started_at?: string;
					submitted_at?: string | null;
					responses?: Json;
					created_at?: string;
				};
				Update: Partial<
					Database["public"]["Tables"]["test_sessions"]["Insert"]
				>;
			};

			test_attempts: {
				Row: {
					id: string;
					user_id: string;
					test_id: string;
					started_at: string;
					submitted_at: string | null;
					score: number | null;
					answers: Json | null;
					status: "in_progress" | "completed";
				};
				Insert: {
					id?: string;
					user_id: string;
					test_id: string;
					started_at?: string;
					submitted_at?: string | null;
					score?: number | null;
					answers?: Json | null;
					status?: "in_progress" | "completed";
				};
				Update: Partial<
					Database["public"]["Tables"]["test_attempts"]["Insert"]
				>;
			};
		};

		Views: {};
		Functions: {};
		Enums: {};
	};
};
