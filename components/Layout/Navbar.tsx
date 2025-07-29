"use client";

import { Menu } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import LaunchUI from "@/components/logos/launch-ui";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Navbar as NavbarComponent,
	NavbarLeft,
	NavbarRight,
} from "@/components/ui/navbar";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeSwitch } from "./ThemeSwitch";
import { useAuth } from "@/context/AuthContext";

interface NavbarLink {
	text: string;
	href: string;
}

interface NavbarActionProps {
	text: string;
	href: string;
	variant?: ButtonProps["variant"];
	icon?: ReactNode;
	iconRight?: ReactNode;
	isButton?: boolean;
}

interface NavbarProps {
	logo?: ReactNode;
	name?: string;
	homeUrl?: string;
	showNavigation?: boolean;
	customNavigation?: ReactNode;
	className?: string;
}

const getMobileLinks = (isLoggedIn: boolean): NavbarLink[] => [
	{ text: "Dashboard", href: isLoggedIn ? "/dashboard" : "/auth/login" },
	{
		text: "Daily Challenge",
		href: isLoggedIn ? "/dashboard/daily" : "/auth/login",
	},
	{ text: "Timed Test", href: isLoggedIn ? "/dashboard/test" : "/auth/login" },
	{
		text: "AI Doubt Solver",
		href: isLoggedIn ? "/dashboard/ai" : "/auth/login",
	},
	{
		text: "Smart Notes",
		href: isLoggedIn ? "/dashboard/notes" : "/auth/login",
	},
	{ text: "Upload DPP", href: isLoggedIn ? "/upload" : "/auth/login" },
];

const getActions = (isLoggedIn: boolean): NavbarActionProps[] =>
	isLoggedIn
		? [
				{
					text: "Dashboard",
					href: "/dashboard",
					isButton: true,
					variant: "default",
				},
				{
					text: "Logout",
					href: "/auth/logout",
					isButton: false,
				},
			]
		: [
				{
					text: "Login",
					href: "/auth/login",
					isButton: false,
				},
				{
					text: "Start Prep",
					href: "/auth/login",
					isButton: true,
					variant: "default",
				},
			];

export default function Navbar({
	logo = <LaunchUI />,
	name = "NEET OS",
	homeUrl = "/",
	showNavigation = true,
	customNavigation,
	className,
}: NavbarProps) {
	const { isLoggedIn } = useAuth();

	const mobileLinks = getMobileLinks(isLoggedIn);
	const actions = getActions(isLoggedIn);

	return (
		<header className={cn("sticky top-0 z-50 -mb-4 pb-4 px-4", className)}>
			<div className="fade-bottom bg-background/15 absolute left-0 h-16 w-full backdrop-blur-lg" />
			<div className="max-w-container relative mx-auto">
				<NavbarComponent>
					<NavbarLeft>
						<Link
							href={homeUrl}
							className="flex items-center gap-2 text-xl font-bold"
						>
							{logo}
							{name}
						</Link>

						{showNavigation && !customNavigation && (
							<nav className="hidden md:flex items-center gap-6 text-sm font-medium ml-8">
								{mobileLinks.slice(0, 3).map((link, index) => (
									<Link
										key={index}
										href={link.href}
										className="text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.text}
									</Link>
								))}
							</nav>
						)}

						{customNavigation && customNavigation}
					</NavbarLeft>

					<NavbarRight>
						<ThemeSwitch />
						{actions.map((action, index) =>
							action.isButton ? (
								<Button
									key={index}
									variant={action.variant || "default"}
									asChild
								>
									<Link href={action.href}>
										{action.icon}
										{action.text}
										{action.iconRight}
									</Link>
								</Button>
							) : (
								<Link
									key={index}
									href={action.href}
									className="hidden text-sm md:block hover:underline"
								>
									{action.text}
								</Link>
							)
						)}

						{/* Mobile Menu */}
						<Sheet>
							<SheetTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="shrink-0 md:hidden"
								>
									<Menu className="size-5" />
									<span className="sr-only">Toggle navigation menu</span>
								</Button>
							</SheetTrigger>

							<SheetContent side="right" className="w-[270px] sm:w-[300px]">
								<SheetTitle className="mb-2">{name}</SheetTitle>
								<div className="mb-6 mt-2 text-lg font-bold text-foreground">
									{name}
								</div>
								<nav className="grid gap-5 text-base font-medium">
									{mobileLinks.map((link, index) => (
										<Link
											key={index}
											href={link.href}
											className="text-muted-foreground hover:text-foreground transition-colors"
										>
											{link.text}
										</Link>
									))}
								</nav>
							</SheetContent>
						</Sheet>
					</NavbarRight>
				</NavbarComponent>
			</div>
		</header>
	);
}
