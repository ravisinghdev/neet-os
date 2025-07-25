export interface DBTestResult {
	id: string;
	user_id: string;
	test_id: string;
	subject: string;
	chapter: string;
	score: number;
	total: number;
	date_taken: string; // ISO string
}

export interface DBUserActivity {
	id: string;
	user_id: string;
	date: string; // ISO string
	hours_studied: number;
	tests_taken: number;
	chapters_completed: number;
	score_avg: number;
}

export type Database = {
	public: {
		Tables: {
			study_plans: {
				Row: {
					id: string;
					user_id: string;
					day: string;
					topic: string;
					duration: string;
					ai_tip: string;
					date: string;
					created_at: string;
				};
				Insert: {
					user_id: string;
					day: string;
					topic: string;
					duration: string;
					ai_tip: string;
					date: string;
				};
				Update: Partial<{
					user_id: string;
					day: string;
					topic: string;
					duration: string;
					ai_tip: string;
					date: string;
				}>;
			};
		};
	};
};
