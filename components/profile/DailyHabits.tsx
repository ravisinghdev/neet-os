"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";
import { CardContainer } from "@/components/ui/CardContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { motion } from "framer-motion";

export function DailyHabits() {
	const {
		profile,
		loading,
		updateField,
		saveAll,
		resetChanges,
		originalProfile,
	} = useUserProfile();

	const [saving, setSaving] = useState(false);

	if (loading) {
		return (
			<CardContainer>
				<p className="text-sm text-muted-foreground">Loading habits...</p>
			</CardContainer>
		);
	}

	if (!profile) return null;

	const isDirty = ["wake_time", "sleep_time", "study_hours"].some(
		(key) => profile[key] !== originalProfile?.[key]
	);

	const handleSave = async () => {
		setSaving(true);
		const error = await saveAll();
		if (!error) toast.success("✅ Habits saved!");
		else toast.error("❌ Save failed");
		setSaving(false);
	};

	const handleUndo = () => {
		resetChanges();
		toast.info("↩️ Changes reverted");
	};

	return (
		<CardContainer>
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
			>
				<h2 className="text-xl font-semibold mb-6">📆 Daily Habits</h2>

				<div className="grid sm:grid-cols-3 gap-6">
					<div className="flex flex-col gap-1.5">
						<Label className="text-muted-foreground text-sm font-medium">
							Wake Time
						</Label>
						<Input
							type="time"
							value={profile.wake_time ?? ""}
							onChange={(e) => updateField("wake_time", e.target.value)}
							className="rounded-md border-input shadow-sm"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label className="text-muted-foreground text-sm font-medium">
							Sleep Time
						</Label>
						<Input
							type="time"
							value={profile.sleep_time ?? ""}
							onChange={(e) => updateField("sleep_time", e.target.value)}
							className="rounded-md border-input shadow-sm"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label className="text-muted-foreground text-sm font-medium">
							Study Hours / Day
						</Label>
						<Input
							type="number"
							min={0}
							max={24}
							value={profile.study_hours ?? ""}
							onChange={(e) =>
								updateField("study_hours", Number(e.target.value))
							}
							className="rounded-md border-input shadow-sm"
							placeholder="e.g. 6"
						/>
					</div>
				</div>

				{isDirty && (
					<div className="flex justify-end gap-3 pt-6">
						<Button onClick={handleSave} disabled={saving}>
							{saving ? <Spinner /> : "Save"}
						</Button>
						<Button variant="outline" onClick={handleUndo}>
							Undo
						</Button>
					</div>
				)}
			</motion.div>
		</CardContainer>
	);
}
