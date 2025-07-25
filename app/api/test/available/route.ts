import { NextResponse } from "next/server";

export async function GET() {
	const mockTests = [
		{
			id: "physics-01",
			title: "Physics Mock Test",
			description: "Full 90-minute NEET-level physics test.",
			subject: "Physics",
			difficulty: "Hard",
		},
		{
			id: "bio-photosynthesis",
			title: "Photosynthesis Practice",
			description: "Topic-wise MCQs from Bio Chapter 12.",
			subject: "Biology",
			difficulty: "Medium",
		},
	];

	return NextResponse.json({ tests: mockTests });
}
