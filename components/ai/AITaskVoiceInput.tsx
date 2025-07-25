"use client";

import { CardContainer } from "@/components/ui/CardContainer";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AITaskVoiceInput() {
	return (
		<CardContainer>
			<h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
				<Mic className="text-red-400" /> Voice Task Input
			</h2>
			<p className="text-sm text-muted-foreground mb-4">
				Tell me what task you'd like to schedule or revise — just say it!
			</p>
			<Button className="bg-red-500 hover:bg-red-600 text-white w-full">
				🎙️ Start Recording
			</Button>
		</CardContainer>
	);
}
