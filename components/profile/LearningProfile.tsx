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

export function LearningProfile() {
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
				<p className="text-sm text-muted-foreground">Loading profile...</p>
			</CardContainer>
		);
	}

	if (!profile) return null;

	const strongSubjects = profile.strong_subjects ?? [];
	const weakSubjects = profile.weak_subjects ?? [];
	const targetCollege = profile.target_college ?? "";

	const isDirty =
		JSON.stringify(strongSubjects) !==
			JSON.stringify(originalProfile?.strong_subjects ?? []) ||
		JSON.stringify(weakSubjects) !==
			JSON.stringify(originalProfile?.weak_subjects ?? []) ||
		targetCollege !== originalProfile?.target_college;

	const handleSave = async () => {
		setSaving(true);
		const error = await saveAll();
		if (!error) toast.success("Learning profile saved!");
		else toast.error("Failed to save.");
		setSaving(false);
	};

	const handleUndo = () => {
		resetChanges();
		toast.info("Changes reverted.");
	};

	return (
		<CardContainer>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
			>
				<h2 className="text-xl font-semibold mb-6">📚 Learning Profile</h2>

				<div className="grid sm:grid-cols-2 gap-6">
					<div className="flex flex-col gap-1.5">
						<Label className="text-muted-foreground text-sm font-medium">
							Strong Subjects
						</Label>
						<Input
							value={strongSubjects.join(", ")}
							onChange={(e) =>
								updateField(
									"strong_subjects",
									e.target.value.split(",").map((s) => s.trim())
								)
							}
							placeholder="e.g., Physics, Chemistry"
							className="border border-input rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-ring"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label className="text-muted-foreground text-sm font-medium">
							Weak Subjects
						</Label>
						<Input
							value={weakSubjects.join(", ")}
							onChange={(e) =>
								updateField(
									"weak_subjects",
									e.target.value.split(",").map((s) => s.trim())
								)
							}
							placeholder="e.g., Biology"
							className="border border-input rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-ring"
						/>
					</div>

					<div className="sm:col-span-2 flex flex-col gap-1.5">
						<Label className="text-muted-foreground text-sm font-medium">
							Target College
						</Label>
						<Input
							value={targetCollege}
							onChange={(e) => updateField("target_college", e.target.value)}
							placeholder="e.g., AIIMS Delhi"
							className="border border-input rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-ring"
						/>
					</div>
				</div>

				{isDirty && (
					<div className="flex justify-end gap-3 pt-6">
						<Button
							onClick={handleSave}
							disabled={saving}
							className="font-semibold"
						>
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
