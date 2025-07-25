"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function TestSubmitButton({
	attemptId,
	getAnswers,
}: {
	attemptId: string;
	getAnswers: () => Record<string, number>;
}) {
	const [submitting, setSubmitting] = useState(false);
	const [score, setScore] = useState<number | null>(null);
	const router = useRouter();
	const params = useSearchParams();

	const handleSubmit = async () => {
		if (!confirm("Are you sure you want to submit the test?")) return;
		setSubmitting(true);
		try {
			const res = await axios.post("/api/test/submit", {
				attemptId,
				answers: getAnswers(),
			});
			setScore(res.data.score);
		} catch (err) {
			alert("Submission failed. Try again.");
		} finally {
			setSubmitting(false);
		}
	};

	if (score !== null) {
		return (
			<div className="mt-4 p-4 border rounded-xl text-center">
				<CheckCircle2 className="mx-auto text-green-500" size={40} />
				<h2 className="text-xl font-bold mt-2">Test Submitted</h2>
				<p className="text-lg text-muted-foreground">Your Score: {score}</p>
				<Button
					className="mt-4"
					onClick={() => router.push("/dashboard/tests")}
				>
					Back to Tests
				</Button>
			</div>
		);
	}

	return (
		<Button
			onClick={handleSubmit}
			disabled={submitting}
			className="w-full mt-4"
		>
			{submitting ? "Submitting..." : "Submit Test"}
		</Button>
	);
}
