"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/useUserProfile";
import { CardContainer } from "@/components/ui/CardContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Spinner from "../ui/spinner";
import { useAuth } from "@/context/AuthContext";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const fields = [
	{ key: "name", label: "Name", placeholder: "Full Name", type: "text" },
	{ key: "age", label: "Age", placeholder: "Age", type: "number" },
	{
		key: "gender",
		label: "Gender",
		placeholder: "Select your Gender",
		type: "select",
		option: [
			{ value: "male", label: "Male" },
			{ value: "female", label: "Female" },
			{ value: "trans", label: "Trans" },
			{ value: "RTNS", label: "Rather not say" },
		],
	},
	{
		key: "location",
		label: "Location",
		placeholder: "City, State",
		type: "text",
	},
];

export function BasicInfo() {
	const {
		profile,
		loading,
		updateField,
		saveAll,
		resetChanges,
		originalProfile,
	} = useUserProfile();

	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !profile?.id) return;

		setUploading(true);
		toast.loading("Uploading avatar...");

		const formData = new FormData();
		formData.append("file", file);

		try {
			const res = await fetch("/api/profile/update/avatar", {
				method: "POST",
				body: formData,
			});

			const data = await res.json();

			if (!res.ok || data.error) {
				throw new Error(data.error || "Avatar upload failed");
			}

			updateField("avatar_url", data.avatarPath);
			toast.success("Avatar updated successfully!");
		} catch (err) {
			console.error(err);
			toast.error("Avatar upload failed.");
		} finally {
			setUploading(false);
			toast.dismiss();
		}
	};

	const handleSave = async () => {
		if (!profile) return;

		setSaving(true);
		toast.loading("Saving profile...");

		try {
			const error = await saveAll();

			if (error) {
				toast.error("Failed to save profile", {
					description: error.message ?? "Something went wrong.",
				});
			} else {
				toast.success("Profile saved successfully!");
			}
		} catch (err) {
			toast.error("Unexpected error occurred.");
			console.error(err);
		} finally {
			setSaving(false);
			toast.dismiss();
		}
	};

	const handleUndo = () => {
		resetChanges();
		toast.info("Changes reverted");
	};

	const isDirty =
		fields.some(({ key }) => profile?.[key] !== originalProfile?.[key]) ||
		profile?.avatar_url !== originalProfile?.avatar_url;

	if (loading || !profile) {
		return (
			<CardContainer>
				<p className="text-sm text-muted-foreground">Loading profile...</p>
			</CardContainer>
		);
	}

	return (
		<CardContainer>
			<div className="flex flex-col gap-6">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-bold tracking-tight">🧑‍💼 Your Profile</h2>
					{isDirty && (
						<div className="flex gap-2">
							<Button size="sm" onClick={handleSave} disabled={saving}>
								{saving ? <Spinner /> : "Save Changes"}
							</Button>
							<Button size="sm" variant="ghost" onClick={handleUndo}>
								Undo
							</Button>
						</div>
					)}
				</div>

				<div className="flex flex-col sm:flex-row items-center gap-6">
					<div className="relative shrink-0">
						{hasMounted && (
							<img
								src={
									profile.avatar_url
										? profile.avatar_url.startsWith("http")
											? profile.avatar_url
											: `https://${process.env.POSTGRES_HOST}.supabase.co/storage/v1/object/public/avatars/${profile.avatar_url}`
										: `https://api.dicebear.com/8.x/thumbs/svg?seed=${profile.name}`
								}
								alt="User Avatar"
								className="w-28 h-28 rounded-full border-4 border-gradient-to-tr from-blue-500 via-pink-500 to-purple-500 shadow-lg"
							/>
						)}

						<Label
							htmlFor="avatar-upload"
							className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-2 py-1 rounded-md cursor-pointer"
						>
							{uploading ? "..." : "Change"}
						</Label>
						<Input
							id="avatar-upload"
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleAvatar}
							disabled={uploading}
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
						{fields.map(({ key, label, placeholder, type }) => (
							<div key={key}>
								<Label className="text-muted-foreground text-sm font-medium">
									{label}
								</Label>
								{type === "select" ? (
									<Select
										value={profile[key] ?? ""}
										onValueChange={(value) => updateField(key, value)}
									>
										<SelectTrigger className="mt-1 focus:ring-2 focus:ring-ring focus:outline-none border border-input px-3 py-2 rounded-md text-sm shadow-sm">
											<SelectValue placeholder={placeholder} />
										</SelectTrigger>
										<SelectContent>
											<SelectContent>
												{fields
													.find((f) => f.key === "gender")
													?.option?.map((opt) => (
														<SelectItem key={opt.value} value={opt.value}>
															{opt.label}
														</SelectItem>
													))}
											</SelectContent>
										</SelectContent>
									</Select>
								) : (
									<Input
										type={type}
										value={profile[key] ?? ""}
										onChange={(e) =>
											updateField(
												key,
												type === "number"
													? Number(e.target.value)
													: e.target.value
											)
										}
										placeholder={placeholder}
										className="mt-1"
									/>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</CardContainer>
	);
}
