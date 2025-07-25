"use client";

import React, { useState, useMemo } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { CardContainer } from "@/components/ui/CardContainer";
import "@/styles/calendar-custom.css"; // defines: .calendar-high, .calendar-mid, .calendar-low

type Log = {
	date: string; // ISO string
	count: number;
};

export function StreakCalendar({ logs }: { logs: Log[] }) {
	const [selected, setSelected] = useState<Date | null>(null);

	const dateCounts = useMemo(() => {
		const map: Record<string, number> = {};
		for (const log of logs) {
			map[log.date] = log.count;
		}
		return map;
	}, [logs]);

	const tileClassName = ({ date }: { date: Date }) => {
		const dateStr = date.toISOString().split("T")[0];
		const count = dateCounts[dateStr] ?? 0;

		if (count >= 3) return "calendar-high";
		if (count === 2) return "calendar-mid";
		if (count === 1) return "calendar-low";
		return "";
	};

	const handleChange: CalendarProps["onChange"] = (value) => {
		// `value` can be Date | [Date, Date] | null
		if (value instanceof Date) {
			setSelected(value);
		}
	};

	return (
		<CardContainer>
			<h2 className="text-xl font-semibold mb-4">📅 Streak Calendar</h2>

			<Calendar
				onChange={handleChange}
				value={selected}
				tileClassName={tileClassName}
				className="rounded-md border border-border shadow-sm"
			/>

			{selected && (
				<p className="mt-3 text-sm text-muted-foreground">
					<strong>{selected.toDateString()}</strong> —{" "}
					{dateCounts[selected.toISOString().split("T")[0]] ?? 0} sessions
				</p>
			)}

			{logs.length === 0 && (
				<p className="text-sm text-muted-foreground mt-2">
					No activity data available. Start solving to track your streak!
				</p>
			)}
		</CardContainer>
	);
}
