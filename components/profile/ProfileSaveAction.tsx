"use client";

import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Loader2, Save, Undo } from "lucide-react";

export const ProfileSaveActions = () => {
	const { editMode, setEditMode, saveAll, resetChanges, isDirty, saving } =
		useUserProfile();

	if (!editMode) {
		return (
			<Button variant="outline" onClick={() => setEditMode(true)}>
				Edit Profile
			</Button>
		);
	}

	return (
		<div className="flex gap-2">
			<Button
				variant="default"
				disabled={!isDirty() || saving}
				onClick={async () => {
					await saveAll();
					setEditMode(false);
				}}
			>
				{saving ? (
					<Loader2 className="w-4 h-4 animate-spin mr-2" />
				) : (
					<Save className="w-4 h-4 mr-2" />
				)}
				Save
			</Button>
			<Button variant="outline" onClick={resetChanges}>
				<Undo className="w-4 h-4 mr-2" />
				Reset
			</Button>
			<Button variant="ghost" onClick={() => setEditMode(false)}>
				Cancel
			</Button>
		</div>
	);
};
