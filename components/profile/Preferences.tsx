"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePreference } from "@/context/PreferenceContext";
import { CardContainer } from "@/components/ui/CardContainer";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { CalendarClock, Languages } from "lucide-react";

export function Preferences() {
	const {
		profile,
		loading,
		updateField,
		saveAll,
		resetChanges,
		originalProfile,
	} = useUserProfile();

	const { setLanguage, setTimeFormat } = usePreference();
	const [saving, setSaving] = useState(false);

	if (loading) {
		return (
			<CardContainer>
				<p className="text-sm text-muted-foreground">Loading preferences...</p>
			</CardContainer>
		);
	}

	if (!profile) return null;

	const isDirty =
		profile.language !== originalProfile?.language ||
		profile.time_format !== originalProfile?.time_format;

	const handleSave = async () => {
		setSaving(true);
		const error = await saveAll();

		if (!error) {
			toast.success("Preferences saved!");
			setLanguage(profile.language);
			setTimeFormat(profile.time_format);
		} else {
			toast.error("Failed to save preferences.");
		}

		setSaving(false);
	};

	const handleUndo = () => {
		resetChanges();
		toast.info("Reverted changes.");
	};

	return (
		<CardContainer>
			<h2 className="text-xl font-semibold mb-6">⚙️ Personal Preferences</h2>

			<div className="grid sm:grid-cols-2 gap-6">
				<div className="flex flex-col gap-2">
					<Label className="flex items-center gap-1 text-sm">
						<Languages className="w-4 h-4" /> Language
					</Label>
					<Select
						value={profile.language ?? "English"}
						onValueChange={(val) => updateField("language", val)}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder={profile.language ?? "English"} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="English">English</SelectItem>
							<SelectItem value="Hindi">Hindi</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-2">
					<Label className="flex items-center gap-1 text-sm">
						<CalendarClock className="w-4 h-4" /> Time Format
					</Label>
					<Select
						value={profile.time_format ?? "24h"}
						onValueChange={(val) => updateField("time_format", val)}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder={profile.time_format ?? "24h"} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="12h">12 Hour</SelectItem>
							<SelectItem value="24h">24 Hour</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{isDirty && (
				<div className="flex justify-end gap-3 pt-6">
					<Button onClick={handleSave} disabled={saving}>
						{saving ? <Spinner /> : "Save Preferences"}
					</Button>
					<Button variant="outline" onClick={handleUndo}>
						Undo Changes
					</Button>
				</div>
			)}

			<p className="text-xs text-muted-foreground mt-5">
				Joined on:{" "}
				{new Date(profile.joined).toLocaleDateString("en-IN", {
					year: "numeric",
					month: "short",
					day: "numeric",
				})}
			</p>
		</CardContainer>
	);
}
