"use client";

import TestModeCard from "@/components/test/test-selector/TestModeSelector";

export default function TestHomePage() {
	return (
		<div className="p-6">
			<div className="flex flex-wrap gap-4">
				<TestModeCard />
			</div>
		</div>
	);
}
