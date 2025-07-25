"use client";

import { CardContainer } from "@/components/ui/CardContainer";
import { Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AIChatPortal() {
	return (
		<CardContainer>
			<h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
				<Bot className="text-blue-400" /> Ask NEET AI
			</h2>
			<div className="flex gap-2">
				<Input
					placeholder="Ask anything about your study..."
					className="flex-1"
				/>
				<Button>Ask</Button>
			</div>
		</CardContainer>
	);
}
