"use client";

import { CardContainer } from "@/components/ui/CardContainer";
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FocusBoosterCard() {
	return (
		<CardContainer>
			<div className="flex items-center justify-between mb-3">
				<h2 className="text-lg font-semibold flex items-center gap-2">
					<Timer className="text-lime-500" /> Focus Booster
				</h2>
				<Button size="sm" className="bg-lime-500 text-white hover:bg-lime-600">
					Start 25-min Session
				</Button>
			</div>
			<p className="text-sm text-muted-foreground">
				Stay in the zone. This Pomodoro cycle helps you stay mentally locked in.
			</p>
		</CardContainer>
	);
}
