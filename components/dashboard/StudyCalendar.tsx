"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function StudyCalendar() {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date()
	);

	return (
		<Card className="p-6 shadow-md">
			<h2 className="text-lg font-semibold mb-4">📅 Study Calendar</h2>

			<Calendar
				mode="single"
				selected={selectedDate}
				onSelect={setSelectedDate}
				className="rounded-md border"
			/>

			{selectedDate && (
				<p className="text-sm text-muted-foreground mt-4">
					You selected{" "}
					<span className="font-medium">
						{selectedDate.toLocaleDateString()}
					</span>
				</p>
			)}
		</Card>
	);
}
