"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export interface TestTimerProps {
	duration: number; // total duration in seconds
	onTimeUp: () => void;
	paused: boolean;
	startTime?: number; // timestamp in ms
}

export default function TestTimer({
	duration,
	onTimeUp,
	paused,
	startTime,
}: TestTimerProps) {
	const [secondsLeft, setSecondsLeft] = useState(duration);

	useEffect(() => {
		const updateTimeLeft = () => {
			const now = Date.now();
			const elapsed = Math.floor((now - startTime!) / 1000);
			const newTimeLeft = Math.max(duration - elapsed, 0);
			setSecondsLeft(newTimeLeft);

			if (newTimeLeft === 0) {
				onTimeUp();
			}
		};

		updateTimeLeft(); // Run initially

		if (paused) return;

		const interval = setInterval(updateTimeLeft, 1000);
		return () => clearInterval(interval);
	}, [paused, startTime, duration, onTimeUp]);

	const formatTime = (secs: number) => {
		const mins = Math.floor(secs / 60)
			.toString()
			.padStart(2, "0");
		const secsRem = (secs % 60).toString().padStart(2, "0");
		return `${mins}:${secsRem}`;
	};

	return (
		<div className="flex items-center gap-2 text-base font-semibold px-4 py-1 border rounded-full border-muted text-muted-foreground">
			<Clock className="w-4 h-4" />
			<span className={secondsLeft <= 60 ? "text-red-500 font-bold" : ""}>
				{formatTime(secondsLeft)}
			</span>
		</div>
	);
}
