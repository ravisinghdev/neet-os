"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { toast } from "sonner";

const LOCAL_STORAGE_KEY = "user-profile";

export const useUserProfile = () => {
	const [profile, setProfile] = useState<any>(null);
	const [originalProfile, setOriginalProfile] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [editMode, setEditMode] = useState(false);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const loadProfile = async () => {
			setLoading(true);

			// First try loading from localStorage
			const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
			if (cached) {
				try {
					const parsed = JSON.parse(cached);
					console.log("[Profile] Loaded from localStorage ✅");
					setProfile(parsed);
					setOriginalProfile(parsed);
					setLoading(false);
					return;
				} catch {
					console.warn("[Profile] Failed to parse cached profile ⚠️");
					localStorage.removeItem(LOCAL_STORAGE_KEY);
				}
			}

			// Fallback to fetching from Supabase
			const {
				data: { session },
				error: sessionError,
			} = await supabase.auth.getSession();
			if (sessionError) {
				console.error(
					"[Profile] Failed to get Supabase session ❌",
					sessionError
				);
				toast.error("Failed to load user session");
				setLoading(false);
				return;
			}

			const userId = session?.user?.id;
			if (!userId) {
				console.warn("[Profile] No user session found ❌");
				setLoading(false);
				return;
			}

			console.log("[Profile] Fetching profile for user ID:", userId);

			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.maybeSingle();

			if (error) {
				console.error("[Profile] Error loading profile ❌", error);
				toast.error("Something went wrong while loading your profile.");
				setLoading(false);
				return;
			}

			if (!data) {
				const defaultProfile = { id: userId, name: "", gender: "", age: 17 };
				await supabase.from("profiles").insert(defaultProfile);
				setProfile(defaultProfile);
				setOriginalProfile(defaultProfile);
				localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultProfile));
				console.log("[Profile] Created default profile for new user ✅");
			} else {
				setProfile(data);
				setOriginalProfile(data);
				localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
				console.log("[Profile] Loaded profile from Supabase ✅");
			}

			setLoading(false);
		};

		loadProfile();
	}, []);

	const updateField = (key: string, value: any) => {
		setProfile((prev: any) => ({ ...prev, [key]: value }));
		console.log(`[Profile] Updated field "${key}" to:`, value);
	};

	const saveAll = async () => {
		if (!profile) return;
		setSaving(true);
		console.log("[Profile] Saving profile changes...");

		const { error } = await supabase.from("profiles").upsert(profile);

		if (error) {
			console.error("[Profile] Failed to save profile ❌", error);
			toast.error("Something went wrong while saving your profile.");
		} else {
			setOriginalProfile(profile);
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
			console.log("[Profile] Profile saved successfully ✅");
			toast.success("Your profile was successfully updated.");
		}

		setSaving(false);
		return error;
	};

	const resetChanges = () => {
		setProfile(originalProfile);
		console.log("[Profile] Reset profile to original values 🔄");
		toast.info("Changes reverted.");
	};

	const isFieldChanged = (key: string) => {
		return profile?.[key] !== originalProfile?.[key];
	};

	const isDirty = () => {
		if (!profile || !originalProfile) return false;
		return Object.keys(profile).some(
			(key) => profile[key] !== originalProfile[key]
		);
	};

	return {
		profile,
		originalProfile,
		loading,
		editMode,
		setEditMode,
		updateField,
		saveAll,
		resetChanges,
		saving,
		isFieldChanged,
		isDirty,
	};
};
