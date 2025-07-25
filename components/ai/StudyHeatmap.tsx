"use client";

import { CardContainer } from "@/components/ui/CardContainer";
import dynamic from "next/dynamic";
import { Flame } from "lucide-react";

const Heatmap = dynamic(() => import("react-calendar-heatmap"), { ssr: false });

export default function StudyHeatmap() {
	const today = new Date();
	const values = Array.from({ length: 150 }, (_, i) => {
		const date = new Date();
		date.setDate(today.getDate() - i);
		return {
			date: date.toISOString().slice(0, 10),
			count: Math.floor(Math.random() * 3),
		};
	});

	return (
		<div className="h-full">
			<CardContainer>
				<h2 className="text-lg font-semibold mb-2 flex items-center gap-2 ">
					<Flame className="text-orange-400" /> Study Streak Heatmap
				</h2>
				<Heatmap
					startDate={new Date(today.setDate(today.getDate() - 150))}
					endDate={new Date()}
					values={values}
					classForValue={(value) =>
						!value ? "color-empty" : `color-scale-${value.count}`
					}
					showWeekdayLabels
				/>
				<style>{`
			.color-empty { fill: #eee }
			.color-scale-1 { fill: #a0e3ff }
			.color-scale-2 { fill: #3db6ff }
			.color-scale-3 { fill: #007acc }
		`}</style>
			</CardContainer>
		</div>
	);
}
