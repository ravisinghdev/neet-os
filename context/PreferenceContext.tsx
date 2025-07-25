"use client";

import { createContext, useContext, useEffect, useState } from "react";

type PreferenceContextType = {
	language: string;
	timeFormat: string;
	setLanguage: (lang: string) => void;
	setTimeFormat: (format: string) => void;
};

const PreferenceContext = createContext<PreferenceContextType | undefined>(
	undefined
);

export function PreferenceProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [language, setLanguage] = useState("English");
	const [timeFormat, setTimeFormat] = useState("24h");

	useEffect(() => {
		const storedLang = localStorage.getItem("pref_lang");
		const storedTime = localStorage.getItem("pref_time");
		if (storedLang) setLanguage(storedLang);
		if (storedTime) setTimeFormat(storedTime);
	}, []);

	const updateLanguage = (lang: string) => {
		localStorage.setItem("pref_lang", lang);
		setLanguage(lang);
	};

	const updateTimeFormat = (format: string) => {
		localStorage.setItem("pref_time", format);
		setTimeFormat(format);
	};

	return (
		<PreferenceContext.Provider
			value={{
				language,
				timeFormat,
				setLanguage: updateLanguage,
				setTimeFormat: updateTimeFormat,
			}}
		>
			{children}
		</PreferenceContext.Provider>
	);
}

export function usePreference() {
	const context = useContext(PreferenceContext);
	if (!context)
		throw new Error("usePreference must be used within PreferenceProvider");
	return context;
}
