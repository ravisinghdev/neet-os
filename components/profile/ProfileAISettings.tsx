"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileField } from "./ProfileField";

export const ProfileAISettings = () => {
	const { profile, editMode, updateField, isFieldChanged } = useUserProfile();

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<ProfileField
				label="AI Question Difficulty"
				field="ai_difficulty"
				value={profile?.ai_difficulty}
				editMode={editMode}
				isChanged={isFieldChanged("ai_difficulty")}
				onChange={updateField}
				placeholder="Easy / Medium / Hard"
			/>
			<ProfileField
				label="AI Personal Coach Enabled"
				field="ai_coach"
				value={profile?.ai_coach ? "Yes" : "No"}
				editMode={editMode}
				isChanged={isFieldChanged("ai_coach")}
				onChange={(field, val) =>
					updateField(field, val.toLowerCase() === "yes")
				}
				placeholder="Yes / No"
			/>
		</div>
	);
};
