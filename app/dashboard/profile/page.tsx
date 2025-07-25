"use client";

import { BasicInfo } from "@/components/profile/BasicInfo";
import { DailyHabits } from "@/components/profile/DailyHabits";
import { GoalTracker } from "@/components/profile/GoalTracker";
import { LearningProfile } from "@/components/profile/LearningProfile";
import { PerformanceStats } from "@/components/profile/PerformanceStats";
import { Preferences } from "@/components/profile/Preferences";
import { ProfileAIInsights } from "@/components/profile/ProfileAIInsights";
import { StreakCalendar } from "@/components/profile/StreakHeatmap";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";

const dummyLogs = [
	{ date: "2025-07-01", count: 2 },
	{ date: "2025-07-03", count: 1 },
	{ date: "2025-07-05", count: 3 },
];

export default function ProfilePage() {
	const { editMode, setEditMode, saveAll, saving, resetChanges } =
		useUserProfile();

	const handleSave = async () => {
		const error = await saveAll();
		if (error) {
			alert("Save failed");
		} else {
			alert("Changes saved!");
			setEditMode(false);
		}
	};

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-extrabold tracking-tight">
					🧬 My NEET Profile
				</h1>
				<div className="space-x-3">
					{editMode ? (
						<>
							<Button variant="outline" onClick={resetChanges}>
								Reset
							</Button>
							<Button onClick={handleSave} disabled={saving}>
								{saving ? "Saving..." : "Save All"}
							</Button>
						</>
					) : (
						<Button onClick={() => setEditMode(true)}>Edit Profile</Button>
					)}
				</div>
			</div>

			{/* All Profile Components */}
			<BasicInfo />
			<PerformanceStats />
			<LearningProfile />
			<DailyHabits />
			<GoalTracker />
			<Preferences />
			<StreakCalendar logs={dummyLogs} />
			<ProfileAIInsights />
		</div>
	);
}
