"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";

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
					setProfile(parsed);
					setOriginalProfile(parsed);
					setLoading(false);
					return;
				} catch {
					localStorage.removeItem(LOCAL_STORAGE_KEY);
				}
			}

			// Fallback to fetching from Supabase
			const {
				data: { session },
			} = await supabase.auth.getSession();
			const userId = session?.user?.id;
			if (!userId) {
				setLoading(false);
				return;
			}

			console.log("Loading profile for user:", userId);

			const { data } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.maybeSingle();

			if (!data) {
				const defaultProfile = { id: userId, name: "", gender: "", age: 17 };
				await supabase.from("profiles").insert(defaultProfile);
				setProfile(defaultProfile);
				setOriginalProfile(defaultProfile);
				localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultProfile));
			} else {
				setProfile(data);
				setOriginalProfile(data);
				localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
			}

			setLoading(false);
		};

		loadProfile();
	}, []);

	const updateField = (key: string, value: any) => {
		setProfile((prev: any) => ({ ...prev, [key]: value }));
	};

	const saveAll = async () => {
		if (!profile) return;
		setSaving(true);
		const { error } = await supabase.from("profiles").upsert(profile);
		if (!error) {
			setOriginalProfile(profile);
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
		}
		setSaving(false);
		return error;
	};

	const resetChanges = () => {
		setProfile(originalProfile);
	};

	// ✅ New: detect if specific field changed
	const isFieldChanged = (key: string) => {
		return profile?.[key] !== originalProfile?.[key];
	};

	// ✅ New: detect if any field changed
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
