"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/server";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function StreakHeatmap() {
	const [dates, setDates] = useState<string[]>([]);
	const supabase = createClient();
	useEffect(() => {
		supabase
			.from("user_activity")
			.select("date")
			.order("date", { ascending: true })
			.then((res) => {
				if (res.data) setDates(res.data.map((r) => r.date || ""));
			});
	}, []);

	const values = dates.map((d) => ({ date: d, count: 1 }));

	return (
		<div>
			<h3 className="text-sm text-muted-foreground mb-2">
				Study Streak (Last 30 days)
			</h3>
			<CalendarHeatmap
				startDate={new Date(new Date().setDate(new Date().getDate() - 30))}
				endDate={new Date()}
				values={values}
				classForValue={(v) => {
					if (!v) return "color-empty";
					return v.count > 0 ? "color-github-4" : "color-empty";
				}}
			/>
		</div>
	);
}
