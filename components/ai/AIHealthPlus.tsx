"use client";

import { CardContainer } from "@/components/ui/CardContainer";
import { HeartPulse } from "lucide-react";

export default function AIHealthPulse() {
	return (
		<CardContainer>
			<div className="flex items-center justify-between mb-3">
				<h2 className="text-lg font-semibold flex items-center gap-2">
					<HeartPulse className="text-red-400 animate-pulse" /> AI Health Pulse
				</h2>
			</div>
			<p className="text-sm text-muted-foreground mb-3">
				Your study stress and mental energy seem stable. You're performing
				within your best range.
			</p>
			<div className="grid grid-cols-2 gap-4 text-center">
				<div>
					<p className="text-xl font-bold text-green-500">78%</p>
					<p className="text-xs text-muted-foreground">Focus Energy</p>
				</div>
				<div>
					<p className="text-xl font-bold text-blue-400">82%</p>
					<p className="text-xs text-muted-foreground">Cognitive Load</p>
				</div>
			</div>
		</CardContainer>
	);
}
