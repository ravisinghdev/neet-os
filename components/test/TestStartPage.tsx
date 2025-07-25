"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import TestHeader from "@/components/test/TestHeader";
import QuestionViewer from "@/components/test/QuestionViewer";
import QuestionNavigator from "@/components/test/QuestionNavigator";
import PauseDialog from "@/components/test/PauseDialog";
import SubmitDialog from "@/components/test/SubmitDialog";
import TestTimer from "@/components/test/TestTimer";
import { QuestionType } from "@/types/test";

type AutoSaveStatus = "saving" | "saved" | "error";

export default function TestStartPage() {
	const router = useRouter();

	// State
	const [questions, setQuestions] = useState<QuestionType[]>([]);
	const [markedQuestions, setMarkedQuestions] = useState<string[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<string, string[]>>({});
	const [isPaused, setIsPaused] = useState(false);
	const [submitOpen, setSubmitOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Mock test data
	const [test, setTest] = useState({
		name: "NEET Biology Full Test",
		duration: 180, // minutes
	});

	const rawAnswers: Record<string, string[]> = {
		"1": ["A"],
		"2": ["B"],
		"3": [], // unanswered
	};

	// Timer
	const [startTime, setStartTime] = useState<number>(Date.now());
	const [remainingTime, setRemainingTime] = useState<number>(
		test.duration * 60
	);

	// Auto save status
	const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("saved");

	// Fetch questions
	useEffect(() => {
		const fetchQuestions = async () => {
			try {
				setIsLoading(true);
				const res = await axios.get("/api/test/start");
				if (res.data?.questions) {
					setQuestions(res.data.questions);
					setError(null);
				} else {
					setError("No questions found.");
				}
			} catch (err) {
				setError("Failed to load test questions.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchQuestions();
	}, []);

	// Transform to required shape
	const singleAnswers: Record<number, string> = Object.fromEntries(
		Object.entries(rawAnswers).map(([key, value]) => [
			parseInt(key),
			value[0] ?? "",
		])
	);

	// Timer logic
	useEffect(() => {
		const interval = setInterval(() => {
			const elapsed = Math.floor((Date.now() - startTime) / 1000);
			const remaining = test.duration * 60 - elapsed;
			setRemainingTime(remaining > 0 ? remaining : 0);
		}, 1000);
		return () => clearInterval(interval);
	}, [startTime, test.duration]);

	// Auto-save simulation every 30s
	useEffect(() => {
		const interval = setInterval(() => {
			setAutoSaveStatus("saving");
			setTimeout(() => {
				const didFail = Math.random() < 0.1;
				setAutoSaveStatus(didFail ? "error" : "saved");
			}, 1000);
		}, 30000);

		return () => clearInterval(interval);
	}, []);

	// Logic handlers
	const handleAnswer = (questionId: string, selected: string[]) => {
		setAnswers((prev) => ({ ...prev, [questionId]: selected }));
	};

	const handleNext = () => {
		if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
	};

	const handlePrev = () => {
		if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
	};

	const handleTimeUp = () => {
		setSubmitOpen(true);
	};

	const handleSubmit = async () => {
		try {
			await axios.post("/api/test/submit", { answers });
			router.push("/dashboard/tests");
		} catch (err) {
			console.error("Submit failed:", err);
		}
	};

	const handleToggleReview = (questionId: string) => {
		setMarkedQuestions((prev) =>
			prev.includes(questionId)
				? prev.filter((id) => id !== questionId)
				: [...prev, questionId]
		);
	};

	const handlePause = () => {
		setIsPaused(true);
	};

	// Rendering logic
	if (isLoading) {
		return (
			<div className="p-4 text-sm text-muted-foreground">Loading test...</div>
		);
	}

	if (error) {
		return <div className="p-4 text-sm text-red-500">{error}</div>;
	}

	if (questions.length === 0) {
		return (
			<div className="p-4 text-sm text-muted-foreground">
				No questions available.
			</div>
		);
	}

	const currentQuestion = questions[currentIndex];
	const selectedOptions = answers[currentQuestion.id] || [];

	return (
		<div className="w-full p-4 grid gap-4">
			<TestHeader
				testName={test.name}
				durationSeconds={test.duration * 60}
				onPause={handlePause}
				onSubmit={handleSubmit}
				startTime={startTime}
			/>

			<TestTimer
				duration={test.duration * 60}
				onTimeUp={handleTimeUp}
				paused={isPaused}
			/>

			<QuestionViewer
				question={currentQuestion}
				selectedOptions={selectedOptions}
				onOptionChange={(selected) =>
					handleAnswer(currentQuestion.id, selected)
				}
				onSelectAnswer={(ans) => handleAnswer(currentQuestion.id, [ans])}
				markedForReview={markedQuestions.includes(currentQuestion.id)}
				onToggleReview={() => handleToggleReview(currentQuestion.id)}
			/>

			<QuestionNavigator
				total={questions.length}
				current={currentIndex}
				onNext={handleNext}
				onPrev={handlePrev}
				onJump={(index) => setCurrentIndex(index)}
				answers={singleAnswers}
			/>

			<div className="flex justify-between items-center gap-4">
				<div className="text-xs text-muted-foreground">
					Auto-save status:{" "}
					<span
						className={
							autoSaveStatus === "saving"
								? "text-yellow-500"
								: autoSaveStatus === "error"
									? "text-red-500"
									: "text-green-500"
						}
					>
						{autoSaveStatus}
					</span>
				</div>

				<button
					onClick={() => setSubmitOpen(true)}
					className="border px-4 py-2 rounded-xl text-sm"
				>
					Submit Test
				</button>
			</div>

			<PauseDialog
				open={isPaused}
				onClose={() => setIsPaused(false)}
				onResume={() => setIsPaused(false)}
			/>

			<SubmitDialog
				open={submitOpen}
				onClose={() => setSubmitOpen(false)}
				onConfirm={handleSubmit}
			/>
		</div>
	);
}
