"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	User,
	Settings,
	Brain,
	BookOpen,
	FileText,
	Notebook,
	Calendar,
	BarChart,
	Target,
	Trophy,
	Lightbulb,
	Upload,
	MessageCircle,
	LogOut,
	ChevronLeft,
	ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { useSidebar } from "@/context/SidebarContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

const navGroups = [
	{
		title: "Dashboard",
		links: [
			{ href: "/dashboard", label: "Home", icon: LayoutDashboard },
			{ href: "/dashboard/profile", label: "Profile", icon: User },
			{ href: "/dashboard/settings", label: "Settings", icon: Settings },
			{ href: "/dashboard/ai-lab", label: "AI Lab", icon: Brain },
		],
	},
	{
		title: "Study Tools",
		links: [
			{ href: "/dashboard/ai-assist", label: "AI Assist", icon: Brain },
			{ href: "/dashboard/study-plan", label: "Study Plan", icon: BookOpen },
			{
				href: "/dashboard/daily-challenge",
				label: "Daily Challenge",
				icon: LightningBoltIcon,
			},
			{ href: "/dashboard/test", label: "Tests", icon: FileText },
			{ href: "/dashboard/notes", label: "My Notes", icon: Notebook },
		],
	},
	{
		title: "Progress & Insights",
		links: [
			{ href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
			{ href: "/dashboard/streak", label: "Streak Calendar", icon: Calendar },
			{ href: "/dashboard/goals", label: "Goal Tracker", icon: Target },
			{ href: "/dashboard/achievements", label: "Achievements", icon: Trophy },
			{
				href: "/dashboard/suggestions",
				label: "AI Suggestions",
				icon: Lightbulb,
			},
		],
	},
	{
		title: "Tools",
		links: [
			{ href: "/dashboard/import", label: "Import Questions", icon: Upload },
			{
				href: "/dashboard/help",
				label: "Help & Feedback",
				icon: MessageCircle,
			},
		],
	},
];

export function Sidebar() {
	const pathname = usePathname();
	const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
	const { isSidebarOpen, closeSidebar } = useSidebar();
	const supabase = createClient();

	const toggleGroup = (title: string) => {
		setCollapsedGroups((prev) =>
			prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
		);
	};

	return (
		<>
			{/* 🖥️ Permanent Sidebar on Desktop */}
			<aside className="overflow-y-auto hidden md:flex flex-col justify-between w-64 h-screen bg-background/80 backdrop-blur-md border-r border-border shadow-md px-4 py-6 z-30">
				<SidebarBody
					pathname={pathname}
					toggleGroup={toggleGroup}
					collapsedGroups={collapsedGroups}
				/>
			</aside>

			{/* 📱 Animated Sidebar on Mobile */}
			<AnimatePresence>
				{isSidebarOpen && (
					<>
						{/* Fade Overlay */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							onClick={closeSidebar}
							className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
						/>

						{/* Slide-in Drawer */}
						<motion.aside
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
							className="fixed top-0 left-0 z-50 h-full w-64 bg-background border-r border-border shadow-lg px-4 py-6 md:hidden"
						>
							<div className="flex justify-between items-center mb-6">
								<h1 className="text-2xl font-bold tracking-tight">
									🧠 NEET OS
								</h1>
								<button
									onClick={closeSidebar}
									className="text-muted-foreground"
								>
									<ChevronLeft />
								</button>
							</div>
							<SidebarBody
								pathname={pathname}
								toggleGroup={toggleGroup}
								collapsedGroups={collapsedGroups}
							/>
						</motion.aside>
					</>
				)}
			</AnimatePresence>
		</>
	);
}

function SidebarBody({
	pathname,
	toggleGroup,
	collapsedGroups,
}: {
	pathname: string;
	toggleGroup: (title: string) => void;
	collapsedGroups: string[];
}) {
	const supabase = createClient();
	return (
		<>
			<nav className="space-y-4">
				{navGroups.map((group) => (
					<div key={group.title}>
						<button
							onClick={() => toggleGroup(group.title)}
							className="flex items-center justify-between w-full px-2 text-muted-foreground font-semibold text-sm uppercase tracking-wide mb-2 hover:text-primary"
						>
							{group.title}
							{collapsedGroups.includes(group.title) ? (
								<ChevronDown size={16} />
							) : (
								<ChevronLeft size={16} className="rotate-90" />
							)}
						</button>
						{!collapsedGroups.includes(group.title) && (
							<div className="space-y-1 pl-2">
								{group.links.map(({ href, label, icon: Icon }) => (
									<Link
										key={href}
										href={href}
										className={cn(
											"flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium",
											pathname === href
												? "bg-muted text-foreground shadow"
												: "hover:bg-muted/50 text-muted-foreground"
										)}
									>
										<Icon size={18} />
										{label}
									</Link>
								))}
							</div>
						)}
					</div>
				))}
			</nav>

			<Button
				onClick={() => supabase.auth.signOut()}
				className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive mt-6"
			>
				<LogOut size={18} />
				Logout
			</Button>
		</>
	);
}
