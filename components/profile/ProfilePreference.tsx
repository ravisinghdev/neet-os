"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileField } from "./ProfileField";

export const ProfilePreferences = () => {
	const { profile, editMode, updateField, isFieldChanged } = useUserProfile();

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<ProfileField
				label="Preferred Study Time"
				field="study_time"
				value={profile?.study_time}
				editMode={editMode}
				isChanged={isFieldChanged("study_time")}
				onChange={updateField}
				placeholder="Morning / Night / Any"
			/>
			<ProfileField
				label="Learning Style"
				field="learning_style"
				value={profile?.learning_style}
				editMode={editMode}
				isChanged={isFieldChanged("learning_style")}
				onChange={updateField}
				placeholder="Visual / Auditory / Practice-based"
			/>
		</div>
	);
};
