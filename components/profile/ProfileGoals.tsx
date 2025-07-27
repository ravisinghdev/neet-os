"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileField } from "./ProfileField";

export const ProfileGoals = () => {
	const { profile, editMode, updateField, isFieldChanged } = useUserProfile();

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<ProfileField
				label="Target Exam"
				field="target_exam"
				value={profile?.target_exam}
				editMode={editMode}
				isChanged={isFieldChanged("target_exam")}
				onChange={updateField}
				placeholder="e.g. NEET 2026"
			/>
			<ProfileField
				label="Target Score"
				field="target_score"
				type="number"
				value={profile?.target_score}
				editMode={editMode}
				isChanged={isFieldChanged("target_score")}
				onChange={updateField}
				placeholder="e.g. 650+"
			/>
		</div>
	);
};
