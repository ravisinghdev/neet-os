"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type OptionType = {
	id: string;
	text: string;
};

type QuestionType = {
	id: string;
	questionNumber: number;
	subject: string;
	questionText: string;
	options: OptionType[];
	type: "single" | "multiple";
};

type QuestionViewerProps = {
	question: QuestionType;
	selectedOptions: string[];
	onSelectAnswer: (answer: string) => void;
	onOptionChange: (selected: string[]) => void;
	markedForReview: boolean;
	onToggleReview: () => void;
};

export default function QuestionViewer({
	question,
	selectedOptions,
	onOptionChange,
	markedForReview,
	onToggleReview,
}: QuestionViewerProps) {
	const isSingleCorrect = question.type === "single";

	const handleChange = (optionId: string) => {
		if (isSingleCorrect) {
			onOptionChange([optionId]);
		} else {
			const updatedOptions = selectedOptions.includes(optionId)
				? selectedOptions.filter((id) => id !== optionId)
				: [...selectedOptions, optionId];
			onOptionChange(updatedOptions);
		}
	};

	return (
		<div className="space-y-4 text-sm">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div className="font-medium text-base">
					Q{question.questionNumber}. {question.subject}
				</div>
				<Badge
					variant={markedForReview ? "default" : "outline"}
					onClick={onToggleReview}
					className={cn(
						"cursor-pointer select-none",
						markedForReview && "bg-yellow-100 text-yellow-800 border-yellow-300"
					)}
				>
					{markedForReview ? "Marked for Review" : "Mark for Review"}
				</Badge>
			</div>

			{/* Question Text */}
			<div
				className="text-[15px] leading-relaxed"
				dangerouslySetInnerHTML={{ __html: question.questionText }}
			/>

			{/* Options */}
			<div className="space-y-2">
				{isSingleCorrect ? (
					<RadioGroup
						value={selectedOptions[0] || ""}
						onValueChange={handleChange}
					>
						{question.options.map((option, index) => (
							<div
								key={index}
								className="flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer hover:bg-muted"
							>
								<RadioGroupItem value={option.id} id={option.id} />
								<label htmlFor={option.id} className="cursor-pointer text-sm">
									{option.text}
								</label>
							</div>
						))}
					</RadioGroup>
				) : (
					question.options.map((option, index) => (
						<div
							key={index}
							className="flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer hover:bg-muted"
							onClick={() => handleChange(option.id)}
						>
							<Checkbox
								checked={selectedOptions.includes(option.id)}
								onCheckedChange={() => handleChange(option.id)}
							/>
							<span className="text-sm">{option.text}</span>
						</div>
					))
				)}
			</div>
		</div>
	);
}
