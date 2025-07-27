import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/server";
import { toast } from "sonner";

const LOCAL_STORAGE_KEY = "user-settings";
const supabase = createClient();

export const useSettings = () => {
	const [original, setOriginal] = useState<any>(null); // original values
	const [settings, setSettings] = useState<any>(null); // editable copy
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSettings = async () => {
			setLoading(true);
			const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
			if (cached) {
				try {
					const parsed = JSON.parse(cached);
					setOriginal(parsed);
					setSettings(parsed);
					setLoading(false);
					return;
				} catch {
					localStorage.removeItem(LOCAL_STORAGE_KEY);
				}
			}

			const {
				data: { session },
			} = await supabase.auth.getSession();
			const userId = session?.user?.id;
			if (!userId) return setLoading(false);

			const { data } = await supabase
				.from("settings")
				.select("*")
				.eq("id", userId)
				.maybeSingle();

			const defaultSettings = {
				id: userId,
				theme: "system",
				font_size: "medium",
				show_badges: true,
				show_heatmap: true,
				show_goal: true,
				show_ai_hint: true,
				daily_test_reminder: true,
			};

			const finalData = data || defaultSettings;
			if (!data) {
				await supabase.from("settings").insert(defaultSettings);
			}

			setOriginal(finalData);
			setSettings(finalData);
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalData));
			setLoading(false);
		};

		fetchSettings();
	}, []);

	const updateSetting = async (key: string, value: any) => {
		try {
			setLoading(true);
			if (!settings) return;
			const updated = { ...settings, [key]: value };
			setSettings(updated);
			const { error } = await supabase.from("settings").upsert(updated);
			if (!error) {
				localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
				setOriginal(updated);
			}

			toast("Setting saved successfully...", {
				description: "Hurreyy!! Your setting saved...",
			});
		} catch (error: any) {
			console.log(
				"Something went wrong while updating settings...",
				error.message
			);
			toast("UH! Something went wrong...", {
				description: "Please try again later.",
			});
		} finally {
			setLoading(false);
		}
	};

	const updateField = (key: string, value: any) => {
		setSettings((prev: any) => ({ ...prev, [key]: value }));
	};

	const resetField = (key: string) => {
		if (!original) return;
		setSettings((prev: any) => ({ ...prev, [key]: original[key] }));
	};

	const isFieldChanged = (key: string) => {
		return settings?.[key] !== original?.[key];
	};

	return {
		settings,
		updateField,
		resetField,
		updateSetting,
		isFieldChanged,
		loading,
	};
};
