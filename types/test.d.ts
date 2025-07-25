export type QuestionType = {
	id: string;
	questionNumber: number;
	subject: string;
	questionText: string;
	options: {
		id: string;
		text: string;
	}[];
	type: "single" | "multiple";
};

export interface Test {
	id: string;
	name: string;
	description: string;
	duration: number; // in minutes
	questions: Question[];
}

export type TestMode =
	| "pyq"
	| "subject"
	| "chapter"
	| "ai"
	| "daily"
	| "custom";

export interface ModeOption {
	id: string;
	name: string;
}
