"use client";

import { Navbar } from "@/components/dashboard/Navbar";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { PreferenceProvider } from "@/context/PreferenceContext";
import { SidebarProvider } from "@/context/SidebarContext";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<PreferenceProvider>
			<SidebarProvider>
				<div className="flex h-screen w-full overflow-hidden">
					{/* Sidebar takes 64px width (16rem) */}
					<Sidebar />

					{/* Content takes the rest of space */}
					<div className="flex-1 flex flex-col">
						<Navbar />
						<main className="flex-1 overflow-y-auto dark:bg-[#0c0c0e]">
							{children}
							{/* <AIButton /> */}
						</main>
					</div>
				</div>
			</SidebarProvider>
		</PreferenceProvider>
	);
}
