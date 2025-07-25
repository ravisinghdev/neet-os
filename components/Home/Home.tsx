"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	UploadCloud,
	Brain,
	Flame,
	BarChart3,
	Moon,
	EyeOffIcon,
	GraduationCap,
	RocketIcon,
} from "lucide-react";
import Link from "next/link";

// Launch UI

import { ReactNode } from "react";

import {
	Item,
	ItemDescription,
	ItemIcon,
	ItemTitle,
} from "@/components/ui/item";
import { Section } from "@/components/ui/section";
import CTA from "@/components/Home/CTA";

interface Item {
	title: string;
	description: string;
	icon: ReactNode;
}

interface ItemsProps {
	title?: string;
	items?: Item[];
	className?: string;
}

export default function Home({
	title = "Why NEET OS is Built Different",
	items = [
		{
			title: "Upload Your DPPs",
			description:
				"Convert your PDFs into structured MCQs in seconds — automated parsing + deduplication.",
			icon: <UploadCloud className="size-5 stroke-1" />,
		},
		{
			title: "Instant Practice Mode",
			description:
				"Jump into questions with real-time feedback, hints, and timer-based attempts.",
			icon: <Flame className="size-5 stroke-1" />,
		},
		{
			title: "AI-Powered Analytics",
			description:
				"Track your accuracy, speed, weak topics, and rank. Let data guide your prep.",
			icon: <BarChart3 className="size-5 stroke-1" />,
		},
		{
			title: "Dark Mode. Light Speed.",
			description:
				"Elegant interface that works beautifully on all devices — dark or light.",
			icon: <Moon className="size-5 stroke-1" />,
		},
		{
			title: "Minimal, Fast, Reliable",
			description:
				"Built with Next.js, Supabase, and Tailwind — fast loading, fast solving.",
			icon: <RocketIcon className="size-5 stroke-1" />,
		},
		{
			title: "Zero Distractions",
			description:
				"Focus on what matters: Questions. Answers. Growth. No bloat, no noise.",
			icon: <EyeOffIcon className="size-5 stroke-1" />,
		},
		{
			title: "Built for NEET 2025 & Beyond",
			description:
				"From DPP to AIR — everything designed for serious aspirants who want to rank.",
			icon: <GraduationCap className="size-5 stroke-1" />,
		},
		{
			title: "Coming Soon: Daily AI Tests",
			description:
				"Smart AI will curate your daily practice sets — based on your performance.",
			icon: <Brain className="size-5 stroke-1" />,
		},
	],
	className,
}: ItemsProps) {
	return (
		<main className="relative w-full min-h-screen overflow-hidden text-foreground">
			{/* === HERO SECTION === */}
			<section className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-6 ">
				<motion.h1
					className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm"
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
				>
					NEET OS: Reinvent Your Prep
				</motion.h1>

				<motion.p
					className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
				>
					Upload. Solve. Analyze. All in one AI-powered dashboard designed to
					make you unstoppable.
				</motion.p>

				<motion.div
					className="mt-8 flex gap-4"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
				>
					<Button asChild size="lg">
						<Link href="/practice">
							<Flame className="mr-2 h-4 w-4" /> Start Practice
						</Link>
					</Button>
					<Button asChild variant="secondary" size="lg">
						<Link href="/upload">
							<UploadCloud className="mr-2 h-4 w-4" /> Upload DPP
						</Link>
					</Button>
				</motion.div>
			</section>

			{/* === FEATURES SECTION === */}
			<Section className={className}>
				<div className="max-w-container mx-auto flex flex-col items-center  sm:gap-20">
					<h2 className="max-w-[560px] text-center text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
						{title}
					</h2>
					{items.length > 0 && (
						<div className="grid auto-rows-fr grid-cols-2 gap-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
							{items.map((item, index) => (
								<Item key={index}>
									<ItemTitle className="flex items-center gap-2">
										<ItemIcon>{item.icon}</ItemIcon>
										{item.title}
									</ItemTitle>
									<ItemDescription>{item.description}</ItemDescription>
								</Item>
							))}
						</div>
					)}
				</div>
			</Section>

			{/* === CALL TO ACTION SECTION === */}
			<CTA />
		</main>
	);
}
