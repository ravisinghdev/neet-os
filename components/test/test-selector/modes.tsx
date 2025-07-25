// app/test/_components/modes.ts
export type FieldConfig = {
	label: string;
	placeholder?: string;
	type: "text" | "number" | "select" | "multiselect";
	options?: string[]; // Optional, will be fetched dynamically for some
};

export type TestMode = {
	name: string;
	description: string;
	fields: { name: string; config: FieldConfig }[];
};

export const allTestModes: TestMode[] = [
	{
		name: "PYQ Papers",
		description: "Practice from past years’ NEET exam papers.",
		fields: [
			{
				name: "year",
				config: {
					label: "Select Year",
					type: "select",
					options: ["2024", "2023", "2022", "2021"],
				},
			},
		],
	},
	{
		name: "Subject wise",
		description: "Choose a subject to focus on.",
		fields: [
			{
				name: "subject",
				config: {
					label: "Select Subject",
					type: "select",
				},
			},
		],
	},
	{
		name: "Chapter wise",
		description: "Practice questions from a specific chapter.",
		fields: [
			{
				name: "subject",
				config: {
					label: "Select Subject",
					type: "select",
				},
			},
			{
				name: "chapter",
				config: {
					label: "Select Chapter",
					type: "select",
				},
			},
		],
	},
	{
		name: "AI generated",
		description: "Let AI generate questions based on a topic.",
		fields: [
			{
				name: "topic",
				config: {
					label: "Enter Topic",
					type: "text",
					placeholder: "e.g. Human Physiology",
				},
			},
		],
	},
	{
		name: "Daily Challenges",
		description: "Test your consistency with today’s daily challenge.",
		fields: [],
	},
	{
		name: "Custom",
		description: "Build your own test with full control.",
		fields: [
			{
				name: "subject",
				config: {
					label: "Select Subject",
					type: "select",
				},
			},
			{
				name: "chapter",
				config: {
					label: "Select Chapter",
					type: "select",
				},
			},
			{
				name: "difficulty",
				config: {
					label: "Difficulty",
					type: "select",
					options: ["Easy", "Medium", "Hard"],
				},
			},
			{
				name: "type",
				config: {
					label: "Question Type",
					type: "select",
					options: ["MCQ", "Integer", "Assertion-Reason"],
				},
			},
			{
				name: "questionCount",
				config: {
					label: "Number of Questions",
					type: "number",
					placeholder: "Enter number",
				},
			},
		],
	},
];
