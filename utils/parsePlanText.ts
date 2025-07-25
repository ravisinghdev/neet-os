export type DayPlan = {
	day: string;
	subject: string;
	chapters: string;
	studyHours: string;
};

export function parsePlanText(planText: string): DayPlan[] {
	const dayBlocks = planText.split(/Day\s*\d\s*:/i).slice(1); // Remove empty first split

	return dayBlocks.map((block, index) => {
		const day = `Day ${index + 1}`;

		// Improved regex: tolerate missing `*`, inconsistent spacing
		const subjectMatch = block.match(/Subject:\s*(.*?)\s*(\*|Chapters:)/i);
		const chaptersMatch = block.match(/Chapters:\s*(.*?)\s*(\*|Study Hours:)/i);
		const hoursMatch = block.match(/Study Hours:\s*(\d+\s*hours?)/i);

		return {
			day,
			subject: subjectMatch?.[1]?.trim() || "N/A",
			chapters: chaptersMatch?.[1]?.trim() || "N/A",
			studyHours: hoursMatch?.[1]?.trim() || "N/A",
		};
	});
}
