"use client";

import { createContext, useContext, useState } from "react";

type SidebarContextType = {
	isSidebarOpen: boolean;
	toggleSidebar: () => void;
	closeSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
	const [isSidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => setSidebarOpen((prev) => !prev);
	const closeSidebar = () => setSidebarOpen(false);

	return (
		<SidebarContext.Provider
			value={{ isSidebarOpen, toggleSidebar, closeSidebar }}
		>
			{children}
		</SidebarContext.Provider>
	);
}

export const useSidebar = () => {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within SidebarProvider");
	}
	return context;
};
