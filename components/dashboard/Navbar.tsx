"use client";

import { Flame, Rocket, Moon, Sun, Menu, Bell, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitch } from "../Layout/ThemeSwitch";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUserProfile } from "@/hooks/useUserProfile";
import { NotificationDropdown } from "./NotificationDropdown";

export function Navbar() {
	const router = useRouter();
	const { user } = useAuth();
	const { profile } = useUserProfile();

	const { toggleSidebar } = useSidebar();
	const [profileData, setProfileData] = useState<any>(null);
	const initials = user?.email?.charAt(0).toUpperCase() ?? "U";

	useEffect(() => {
		const fetchProfile = async () => {
			if (!user) return;
			const { data } = await supabase
				.from("users")
				.select("streak, xp")
				.eq("id", user.id)
				.single();
			setProfileData(data);
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
				{profileData && (
					<>
						<Badge
							variant="secondary"
							className="flex items-center gap-1 text-orange-500 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300"
						>
							<Flame size={14} />
							{profileData.streak ?? 0}d
						</Badge>
						<Badge
							variant="secondary"
							className="flex items-center gap-1 text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300"
						>
							<Rocket size={14} />
							{profileData.xp ?? 0} XP
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
				<NotificationDropdown
					notifications={[
						{
							id: "1",
							title: "New Test Released",
							description: "Chapter-wise test on Thermodynamics",
							time: "Just now",
						},
						{
							id: "2",
							title: "AI Insight Available",
							description: "Your performance on Physics improved by 12%",
							time: "1h ago",
						},
					]}
				/>

				{/* Avatar */}
				<div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Avatar className="h-10 w-10 cursor-pointer">
								<AvatarImage
									src={profile?.avatar_url || ""}
									alt="User avatar"
								/>
								<AvatarFallback>{initials}</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>

						<DropdownMenuContent align="end" className="w-40">
							<DropdownMenuItem
								onClick={() => router.push("/dashboard/profile")}
							>
								🧑 Profile
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => router.push("/dashboard/settings")}
							>
								⚙️ Settings
							</DropdownMenuItem>
							<DropdownMenuItem>🚪 Logout</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
