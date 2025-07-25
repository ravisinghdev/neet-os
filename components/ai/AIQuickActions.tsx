"use client";

import { CardContainer } from "@/components/ui/CardContainer";
import { Button } from "@/components/ui/button";
import { Sparkles, PlayCircle, NotebookPen } from "lucide-react";

const actions = [
	{ icon: <Sparkles className="text-yellow-400" />, label: "Revise Last Test" },
	{
		icon: <NotebookPen className="text-green-500" />,
		label: "Create New Notes",
	},
	{ icon: <PlayCircle className="text-purple-500" />, label: "Start AI Test" },
];

export default function AIQuickActions() {
	return (
		<CardContainer>
			<h2 className="text-lg font-semibold mb-3">⚡ AI Quick Actions</h2>
			<div className="flex flex-wrap gap-3">
				{actions.map((action, i) => (
					<Button
						key={i}
						variant="ghost"
						className="flex items-center gap-2 border border-gray-300/10 shadow px-3 py-2"
					>
						{action.icon}
						{action.label}
					</Button>
				))}
			</div>
		</CardContainer>
	);
}
