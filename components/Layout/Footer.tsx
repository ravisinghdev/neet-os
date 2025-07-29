import { ReactNode } from "react";

import { cn } from "@/lib/utils";

import LaunchUI from "@/components/logos/launch-ui";
import {
	Footer,
	FooterBottom,
	FooterColumn,
	FooterContent,
} from "@/components/ui/footer";
import { ModeToggle } from "@/components/ui/mode-toggle";

interface FooterLink {
	text: string;
	href: string;
}

interface FooterColumnProps {
	title: string;
	links: FooterLink[];
}

interface FooterProps {
	logo?: ReactNode;
	name?: string;
	columns?: FooterColumnProps[];
	copyright?: string;
	policies?: FooterLink[];
	showModeToggle?: boolean;
	className?: string;
}

export default function FooterSection({
	logo = <LaunchUI />,
	name = "NEET OS",
	columns = [
		{
			title: "Study Tools",
			links: [
				{ text: "Question Bank", href: "/dashboard/questions" },
				{ text: "Timed Tests", href: "/dashboard/tests" },
				{ text: "Daily Challenges", href: "/dashboard/daily" },
				{ text: "Smart Notes", href: "/dashboard/notes" },
				{ text: "AI Doubt Solver", href: "/dashboard/ai" },
			],
		},
		{
			title: "Company",
			links: [
				{ text: "About NEET OS", href: "/about" },
				{ text: "Our Mission", href: "/mission" },
				{ text: "Careers", href: "/careers" },
				{ text: "Blog", href: "/blog" },
			],
		},
		{
			title: "Support",
			links: [
				{ text: "Help Center", href: "/help" },
				{ text: "Contact Us", href: "/contact" },
				{ text: "Community Discord", href: "https://discord.gg/neetos" },
				{ text: "System Status", href: "/status" },
			],
		},
	],
	copyright = "© 2025 NEET OS • Empowering NEET Aspirants with AI 🚀 | All rights reserved",
	policies = [
		{ text: "Privacy Policy", href: "/privacy" },
		{ text: "Terms of Service", href: "/terms" },
		{ text: "Refund Policy", href: "/refunds" },
	],
	showModeToggle = true,
	className,
}: FooterProps) {
	return (
		<footer className={cn("bg-background w-full px-4", className)}>
			<div className="max-w-container mx-auto">
				<Footer>
					<FooterContent>
						<FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-2">
									{logo}
									<h3 className="text-xl font-bold">{name}</h3>
								</div>
								<p className="text-sm text-muted-foreground max-w-xs">
									India's smartest NEET preparation platform.
								</p>
							</div>
						</FooterColumn>

						{columns.map((column, index) => (
							<FooterColumn key={index}>
								<h3 className="text-md pt-1 font-semibold">{column.title}</h3>
								{column.links.map((link, linkIndex) => (
									<a
										key={linkIndex}
										href={link.href}
										className="text-muted-foreground text-sm hover:underline"
									>
										{link.text}
									</a>
								))}
							</FooterColumn>
						))}
					</FooterContent>

					<FooterBottom>
						<div className="text-sm text-muted-foreground">{copyright}</div>
						<div className="flex items-center gap-4 text-sm">
							{policies.map((policy, index) => (
								<a key={index} href={policy.href} className="hover:underline">
									{policy.text}
								</a>
							))}
							{showModeToggle && <ModeToggle />}
						</div>
					</FooterBottom>
				</Footer>
			</div>
		</footer>
	);
}
