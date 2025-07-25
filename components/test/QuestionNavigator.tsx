"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type QuestionStatus = "not-visited" | "answered" | "not-answered" | "review";

interface QuestionNavigatorProps {
	total: number;
	current: number;
	onNext: () => void;
	onPrev: () => void;
	onJump: (index: number) => void;
	answers: Record<number, string>;
}

export default function QuestionNavigator({
	total,
	current,
	onNext,
	onPrev,
	onJump,
	answers,
}: QuestionNavigatorProps) {
	const getStatus = (index: number): QuestionStatus => {
		if (index in answers) {
			return answers[index] ? "answered" : "not-answered";
		}
		return "not-visited";
	};

	const statusColors: Record<QuestionStatus, string> = {
		"not-visited": "bg-gray-300",
		"not-answered": "bg-red-400",
		answered: "bg-green-500",
		review: "bg-yellow-400", // if you want review feature, add logic later
	};

	return (
		<div className="flex flex-col gap-3">
			<ScrollArea className="h-[calc(100vh-160px)] w-full pr-2">
				<div className="grid grid-cols-5 gap-2 p-2 text-sm">
					{Array.from({ length: total }).map((_, index) => {
						const status = getStatus(index);
						const isActive = current === index;

						return (
							<Button
								key={index}
								size="sm"
								variant="ghost"
								className={cn(
									"h-9 w-9 rounded-full border",
									statusColors[status],
									isActive && "ring-2 ring-blue-600"
								)}
								onClick={() => onJump(index)}
							>
								{index + 1}
							</Button>
						);
					})}
				</div>
			</ScrollArea>

			<div className="flex items-center justify-between px-4">
				<Button onClick={onPrev} disabled={current === 0} variant="outline">
					Previous
				</Button>
				<Button
					onClick={onNext}
					disabled={current === total - 1}
					variant="outline"
				>
					Next
				</Button>
			</div>
		</div>
	);
}
