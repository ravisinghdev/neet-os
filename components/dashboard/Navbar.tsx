"use client";

import { Flame, Rocket, Moon, Sun, Menu, Bell, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitch } from "../Layout/ThemeSwitch";

export function Navbar() {
	const { theme, setTheme } = useTheme();
	const { user } = useAuth();
	const { toggleSidebar } = useSidebar();
	const [profile, setProfile] = useState<any>(null);
	const initials = user?.email?.charAt(0).toUpperCase() ?? "U";

	useEffect(() => {
		const fetchProfile = async () => {
			if (!user) return;
			const { data } = await supabase
				.from("users")
				.select("streak, xp")
				.eq("id", user.id)
				.single();
			setProfile(data);
		};
		fetchProfile();
	}, [user]);

	return (
		<header className="sticky top-0 z-40 w-full bg-background/80 border-b border-border shadow-sm backdrop-blur-lg px-4 py-2 flex items-center justify-between">
			{/* LEFT */}
			<div className="flex items-center gap-3 sm:gap-4">
				{/* Sidebar toggle */}
				<button
					onClick={toggleSidebar}
					className="p-2 rounded-md border border-border hover:bg-muted/30 block md:hidden"
				>
					<Menu size={20} />
				</button>

				<h1 className="text-lg font-semibold">NEET OS</h1>

				{/* Badges */}
				{profile && (
					<>
						<Badge
							variant="secondary"
							className="flex items-center gap-1 text-orange-500 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300"
						>
							<Flame size={14} />
							{profile.streak ?? 0}d
						</Badge>
						<Badge
							variant="secondary"
							className="flex items-center gap-1 text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300"
						>
							<Rocket size={14} />
							{profile.xp ?? 0} XP
						</Badge>
					</>
				)}
			</div>

			{/* RIGHT */}
			<div className="flex items-center gap-3 sm:gap-4">
				{/* Search (optional visible) */}
				<div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-lg border border-border text-sm text-muted-foreground">
					<Search size={16} />
					<input
						placeholder="Search..."
						className="bg-transparent outline-none w-32 sm:w-48"
					/>
				</div>

				{/* Theme */}
				<ThemeSwitch />

				{/* Notification */}
				<button className="hover:text-foreground text-muted-foreground">
					<Bell size={18} />
				</button>

				{/* Avatar */}
				<div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow">
					{initials}
				</div>
			</div>
		</header>
	);
}
