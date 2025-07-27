"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/context/AuthContext";

import { ProfileField } from "@/components/profile/ProfileField";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileGoals } from "@/components/profile/ProfileGoals";
import { ProfilePreferences } from "@/components/profile/ProfilePreference";
import { ProfileAISettings } from "@/components/profile/ProfileAISettings";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Save, Undo2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/glass-card";
import Spinner from "@/components/ui/spinner";

export default function ProfilePage() {
	const {
		profile,
		editMode,
		setEditMode,
		updateField,
		isFieldChanged,
		saveAll,
		resetChanges,
		saving,
		isDirty,
		loading,
	} = useUserProfile();
	const { user } = useAuth();

	if (loading || !profile) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<Spinner />
			</div>
		);
	}
	if (!user) {
		// Handle unauthenticated state
		return <p>User not logged in</p>;
	}

	const name = user.user_metadata?.full_name ?? "Guest";
	const email = user.user_metadata?.email ?? "";

	return (
		<div className="space-y-8 pb-20">
			<Card>
				<CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div>
						<CardTitle className="text-2xl font-bold">👤 Profile</CardTitle>
						<p className="text-muted-foreground text-sm">
							View and edit your profile details
						</p>
					</div>

					<div className="flex flex-wrap gap-2 justify-end">
						{editMode && isDirty() && (
							<Button
								variant="ghost"
								onClick={resetChanges}
								className="text-red-500 hover:text-red-600"
							>
								<Undo2 className="mr-2 w-4 h-4" />
								Reset
							</Button>
						)}

						{editMode && (
							<Button variant="default" onClick={saveAll} disabled={saving}>
								<Save className="mr-2 w-4 h-4" />
								{saving ? <Spinner /> : "Save"}
							</Button>
						)}

						<Button
							variant={editMode ? "outline" : "secondary"}
							onClick={() => setEditMode(!editMode)}
						>
							{editMode ? (
								<>
									<XCircle className="mr-2 w-4 h-4" />
									Cancel
								</>
							) : (
								<>
									<Pencil className="mr-2 w-4 h-4" />
									Edit
								</>
							)}
						</Button>
					</div>
				</CardHeader>

				<CardHeader>
					<CardTitle className="flex items-center gap-4">
						<Avatar className="h-12 w-12">
							<AvatarImage src={profile.avatar_url || ""} />
						</Avatar>
						<span>Basic Information</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<ProfileField
						label="Name"
						field="name"
						value={name}
						editMode={editMode}
						onChange={updateField}
						isChanged={isFieldChanged("name")}
						placeholder="Enter your name"
					/>
					<ProfileField
						label="Email"
						field="email"
						value={email}
						editMode={false}
						onChange={() => {}}
						type="email"
					/>
					<ProfileField
						label="Age"
						field="age"
						value={profile.age}
						editMode={editMode}
						onChange={updateField}
						isChanged={isFieldChanged("age")}
						type="number"
					/>
					<ProfileField
						label="Gender"
						field="gender"
						value={
							profile.gender.slice(0, 1).toUpperCase() +
							profile.gender.slice(1).toLowerCase()
						}
						editMode={editMode}
						onChange={updateField}
						isChanged={isFieldChanged("gender")}
						placeholder="Male / Female"
					/>
					<ProfileField
						label="Location"
						field="location"
						value={profile.location}
						editMode={editMode}
						onChange={updateField}
						isChanged={isFieldChanged("location")}
						placeholder="Enter your city"
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>📊 Academic Stats</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<ProfileField
						label="Streak"
						field="streak"
						value={profile.streak}
						editMode={false}
						onChange={() => {}}
						type="number"
					/>
					<ProfileField
						label="Tests Taken"
						field="tests_taken"
						value={profile.tests_taken ?? 0}
						editMode={false}
						onChange={() => {}}
						type="number"
					/>
					<ProfileField
						label="Average Score"
						field="avg_score"
						value={profile.avg_score ?? 0}
						editMode={false}
						onChange={() => {}}
						type="number"
					/>
					<ProfileField
						label="Strong Subjects"
						field="strong_subjects"
						value={(profile.strong_subjects || []).join(", ")}
						editMode={editMode}
						onChange={(field, value) => updateField(field, value.split(","))}
						isChanged={isFieldChanged("strong_subjects")}
						placeholder="Physics, Biology"
					/>
					<ProfileField
						label="Weak Subjects"
						field="weak_subjects"
						value={(profile.weak_subjects || []).join(", ")}
						editMode={editMode}
						onChange={(field, value) => updateField(field, value.split(","))}
						isChanged={isFieldChanged("weak_subjects")}
						placeholder="Chemistry"
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>🎯 Goals & Preferences</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<ProfileField
						label="Target College"
						field="target_college"
						value={profile.target_college}
						editMode={editMode}
						onChange={updateField}
						isChanged={isFieldChanged("target_college")}
					/>
					<ProfileField
						label="Goal Rank"
						field="goal_rank"
						value={profile.goal_rank}
						editMode={editMode}
						onChange={updateField}
						isChanged={isFieldChanged("goal_rank")}
					/>
					<ProfileField
						label="Weight Goal (kg)"
						field="weight_goal"
						value={profile.weight_goal}
						editMode={editMode}
						onChange={updateField}
						isChanged={isFieldChanged("weight_goal")}
						type="number"
					/>
					<ProfileField
						label="Preferred Language"
						field="language"
						value={profile.language}
						editMode={editMode}
						onChange={updateField}
						isChanged={isFieldChanged("language")}
					/>
					<ProfileField
						label="Time Format"
						field="time_format"
						value={profile.time_format}
						editMode={editMode}
						onChange={updateField}
						isChanged={isFieldChanged("time_format")}
						placeholder="12h / 24h"
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>🕓 Daily Routine</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<ProfileField
						label="Sleep Time"
						field="sleep_time"
						value={profile.sleep_time}
						editMode={editMode}
						onChange={updateField}
						isChanged={isFieldChanged("sleep_time")}
						placeholder="22:30"
					/>
					<ProfileField
						label="Wake Time"
						field="wake_time"
						value={profile.wake_time}
						editMode={editMode}
						onChange={updateField}
						isChanged={isFieldChanged("wake_time")}
						placeholder="06:30"
					/>
					<ProfileField
						label="Study Hours (per day)"
						field="study_hours"
						value={profile.study_hours}
						editMode={editMode}
						onChange={updateField}
						isChanged={isFieldChanged("study_hours")}
						type="number"
						placeholder="e.g. 6"
					/>
				</CardContent>
			</Card>

			<GlassCard>
				<ProfileStats />
				<ProfileGoals />
				<ProfilePreferences />
				<ProfileAISettings />
				{/* <ProfileSaveActions /> */}
			</GlassCard>
		</div>
	);
}
