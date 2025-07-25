"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";
import { CardContainer } from "@/components/ui/CardContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

export function GoalTracker() {
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
				<p className="text-sm text-muted-foreground">Loading goals...</p>
			</CardContainer>
		);
	}

	if (!profile) return null;

	const isDirty =
		profile.goal_rank !== originalProfile?.goal_rank ||
		profile.weight_goal !== originalProfile?.weight_goal;

	const handleSave = async () => {
		setSaving(true);
		const error = await saveAll();
		if (!error) toast.success("Goals updated!");
		else toast.error("Failed to save goals.");
		setSaving(false);
	};

	const handleReset = () => {
		resetChanges();
		toast.info("Reverted unsaved changes.");
	};

	return (
		<CardContainer>
			<h2 className="text-xl font-semibold mb-4">🎯 Your Goals</h2>

			<div className="grid sm:grid-cols-2 gap-4">
				<div>
					<Label>Target NEET Rank</Label>
					<Input
						type="number"
						min={1}
						value={profile.goal_rank ?? ""}
						onChange={(e) => updateField("goal_rank", Number(e.target.value))}
						placeholder="e.g. 500"
					/>
				</div>

				<div>
					<Label>Fitness Goal</Label>
					<Input
						type="text"
						value={profile.weight_goal ?? ""}
						onChange={(e) => updateField("weight_goal", e.target.value)}
						placeholder="e.g. 70kg Lean"
					/>
				</div>
			</div>

			{isDirty && (
				<div className="flex justify-end gap-3 pt-4">
					<Button onClick={handleSave} disabled={saving}>
						{saving ? <Spinner /> : "Save"}
					</Button>
					<Button variant="outline" onClick={handleReset}>
						Undo
					</Button>
				</div>
			)}
		</CardContainer>
	);
}
