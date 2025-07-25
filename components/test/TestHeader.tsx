"use client";

import { Button } from "@/components/ui/button";
import { Clock, Pause, Save, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type TestHeaderProps = {
	testName: string;
	durationSeconds: number;
	onPause: () => void;
	onSubmit: () => void;
	autoSaveStatus?: "saving" | "saved" | "error";
	startTime: any;
};

export default function TestHeader({
	testName,
	durationSeconds,
	onPause,
	onSubmit,
	autoSaveStatus = "saved",
	startTime,
}: TestHeaderProps) {
	const [remaining, setRemaining] = useState(durationSeconds);

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
			const elapsed = Math.floor(
				(now.getTime() - new Date(startTime).getTime()) / 1000
			);
			const left = durationSeconds - elapsed;
			setRemaining(left > 0 ? left : 0);
		}, 1000);

		return () => clearInterval(interval);
	}, [startTime, durationSeconds]);

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const s = (seconds % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	return (
		<header className="flex items-center justify-between w-full px-6 py-3 border-b bg-white shadow-sm sticky top-0 z-50">
			<div className="text-xl font-semibold text-blue-700">{testName}</div>

			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2 text-sm text-gray-700">
					<Clock className="w-5 h-5 text-blue-600" />
					<span className="font-mono">{formatTime(remaining)}</span>
				</div>

				<div
					className={cn(
						"flex items-center gap-1 text-xs px-2 py-1 rounded-full border",
						autoSaveStatus === "saving"
							? "text-yellow-600 border-yellow-400"
							: autoSaveStatus === "error"
								? "text-red-600 border-red-400"
								: "text-green-600 border-green-400"
					)}
				>
					<Save className="w-4 h-4" />
					<span>
						{autoSaveStatus === "saving"
							? "Saving..."
							: autoSaveStatus === "error"
								? "Failed"
								: "Saved"}
					</span>
				</div>

				<Button size="sm" variant="outline" className="gap-2" onClick={onPause}>
					<Pause className="w-4 h-4" />
					Pause
				</Button>

				<Button
					size="sm"
					className="bg-green-600 text-white hover:bg-green-700 gap-2"
					onClick={onSubmit}
				>
					<Send className="w-4 h-4" />
					Submit
				</Button>
			</div>
		</header>
	);
}
