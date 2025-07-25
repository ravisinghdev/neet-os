// components/Timer.tsx
"use client";
import { useEffect, useState } from "react";

export default function Timer() {
	const [time, setTime] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => setTime((t) => t + 1), 1000);
		return () => clearInterval(timer);
	}, []);

	const format = (t: number) => {
		const m = Math.floor(t / 60);
		const s = t % 60;
		return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
	};

	return (
		<div className="text-sm mb-4">
			⏱️ Time Elapsed: <span className="font-mono">{format(time)}</span>
		</div>
	);
}
