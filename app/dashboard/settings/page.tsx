"use client";

import { useState } from "react";
import { AppearanceSettings } from "@/components/settings/sections/AppearanceSettings";
import { AiSettings } from "@/components/settings/sections/AiSettings";
import { NotificationSettings } from "@/components/settings/sections/NotificationSettings";
import { PrivacySettings } from "@/components/settings/sections/PrivacySettings";
import { TestDefaultsSettings } from "@/components/settings/sections/TestDefaultsSettings";
import { AppInfoSettings } from "@/components/settings/sections/AppInfoSettings";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

export default function SettingsPage() {
	const sectionIds = [
		"appearance",
		"ai",
		"notifications",
		"privacy",
		"test",
		"info",
	];
	const active = useActiveSection(sectionIds);
	const [open, setOpen] = useState(false);

	return (
		<div className="flex flex-col lg:flex-row max-w-6xl mx-auto min-h-screen p-4 gap-6 relative">
			{/* Mobile Sidebar Toggle */}
			<div className="lg:hidden flex items-center justify-between mb-4">
				<h1 className="text-xl font-semibold">Settings</h1>
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon">
							<Menu className="w-5 h-5" />
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-64 p-0">
						<SettingsSidebar
							active={active}
							onNavigate={() => setOpen(false)}
						/>
					</SheetContent>
				</Sheet>
			</div>

			{/* Desktop Sidebar */}
			<aside className="hidden lg:block h-screen w-[25%] shrink-0">
				<SettingsSidebar active={active} />
			</aside>

			{/* Main Content */}
			<main className="flex-1 space-y-8 scroll-smooth">
				<section id="appearance">
					<AppearanceSettings />
				</section>
				<section id="ai">
					<AiSettings />
				</section>
				<section id="notifications">
					<NotificationSettings />
				</section>
				<section id="privacy">
					<PrivacySettings />
				</section>
				<section id="test">
					<TestDefaultsSettings />
				</section>
				<section id="info">
					<AppInfoSettings />
				</section>
			</main>
		</div>
	);
}

function SettingsSidebar({
	active,
	onNavigate,
}: {
	active: string;
	onNavigate?: () => void;
}) {
	const links = [
		{ id: "appearance", label: "Appearance" },
		{ id: "ai", label: "AI" },
		{ id: "notifications", label: "Notifications" },
		{ id: "privacy", label: "Privacy" },
		{ id: "test", label: "Test Defaults" },
		{ id: "info", label: "App Info" },
	];

	return (
		<nav className="p-4 space-y-2 fixed h-screen overflow-y-auto">
			{links.map((link) => (
				<Link
					key={link.id}
					href={`#${link.id}`}
					onClick={onNavigate}
					className={`block px-3 py-2 rounded-md text-sm font-medium transition w-full ${
						active === link.id
							? "bg-default"
							: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
					}`}
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}
