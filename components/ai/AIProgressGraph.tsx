"use client";

import { CardContainer } from "@/components/ui/CardContainer";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const data = Array.from({ length: 10 }, (_, i) => ({
	name: `Week ${i + 1}`,
	score: 60 + Math.floor(Math.random() * 40),
}));

export default function AIProgressGraph() {
	return (
		<CardContainer>
			<h2 className="text-lg font-semibold mb-3">📈 Performance Trend</h2>
			<ResponsiveContainer width="100%" height={200}>
				<LineChart data={data}>
					<XAxis dataKey="name" />
					<YAxis domain={[0, 100]} />
					<Tooltip />
					<Line
						type="monotone"
						dataKey="score"
						stroke="#8884d8"
						strokeWidth={2}
					/>
				</LineChart>
			</ResponsiveContainer>
		</CardContainer>
	);
}
