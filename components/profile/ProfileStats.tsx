"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileField } from "./ProfileField";

export const ProfileStats = () => {
	const { profile, loading, updateField, editMode, isFieldChanged } =
		useUserProfile();

	if (loading) {
		return <Skeleton className="h-[120px] w-full rounded-xl" />;
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<ProfileField
				label="Age"
				field="age"
				type="number"
				value={profile?.age}
				editMode={editMode}
				isChanged={isFieldChanged("age")}
				onChange={updateField}
			/>
			<ProfileField
				label="Gender"
				field="gender"
				value={profile?.gender}
				editMode={editMode}
				isChanged={isFieldChanged("gender")}
				onChange={updateField}
				placeholder="Male / Female / Other"
			/>
		</div>
	);
};
