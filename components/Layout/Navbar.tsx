"use client";

import { Menu } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";

import { cn } from "@/lib/utils";

import LaunchUI from "@/components/logos/launch-ui";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Navbar as NavbarComponent,
	NavbarLeft,
	NavbarRight,
} from "@/components/ui/navbar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitch } from "./ThemeSwitch";
import Link from "next/link";
import { supabase } from "@/lib/supabase/supabase";
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
	mobileLinks?: NavbarLink[];
	actions?: NavbarActionProps[];
	showNavigation?: boolean;
	customNavigation?: ReactNode;
	className?: string;
}

export default function Navbar({
	logo = <LaunchUI />,
	name = "NEET OS",
	homeUrl = "/",
	mobileLinks = [
		{ text: "Test", href: "/test" },
		{ text: "Upload DPP", href: "/upload" },
		{ text: "Dashboard", href: "/dashboard" },
	],
	actions = [
		{ text: "Login", href: "/auth/login", isButton: false },
		{
			text: "Start Prep",
			href: "/test",
			isButton: true,
			variant: "default",
		},
	],
	showNavigation = true,
	customNavigation,
	className,
}: NavbarProps) {
	const { isLoggedIn } = useAuth();
	return (
		<header className={cn("sticky top-0 z-50 -mb-4 pb-4 px-4", className)}>
			<div className="fade-bottom bg-background/15 absolute left-0 h-16 w-full backdrop-blur-lg"></div>
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
						)}

						{customNavigation && customNavigation}
					</NavbarLeft>

					<NavbarRight>
						<ThemeSwitch />
						{isLoggedIn ? (
							<Button variant={"default"}>
								<Link href={"/dashboard"}>Dashboard</Link>
							</Button>
						) : (
							<>
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
											className="hidden text-sm md:block"
										>
											{action.text}
										</Link>
									)
								)}
							</>
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

							<SheetContent side="right">
								<nav className="grid gap-6 text-lg font-medium">
									<Link
										href={homeUrl}
										className="flex items-center gap-2 text-xl font-bold"
									>
										<span>{name}</span>
									</Link>
									{mobileLinks.map((link, index) => (
										<Link
											key={index}
											href={link.href}
											className="text-muted-foreground hover:text-foreground"
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
