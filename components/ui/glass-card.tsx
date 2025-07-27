"use client";

import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils"; // Or use classnames if you prefer

type Props = {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	onClick?: () => void;
};

export default function GlassCard({
	children,
	className,
	delay = 0.1,
	onClick,
}: Props) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay }}
			onClick={onClick}
			className={cn(
				"rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 p-5",
				"backdrop-blur-md",
				"cursor-pointer", // make it look clickable
				className
			)}
		>
			{children}
		</motion.div>
	);
}
