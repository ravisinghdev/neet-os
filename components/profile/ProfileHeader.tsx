"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import Image from "next/image";

type ProfileHeaderProps = {
	name: string;
	username: string;
	role: string;
	avatarUrl?: string;
	isEditing: boolean;
	onEditToggle: () => void;
};

export function ProfileHeader({
	name,
	username,
	role,
	avatarUrl,
	isEditing,
	onEditToggle,
}: ProfileHeaderProps) {
	const initials = name
		?.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex items-center justify-between gap-6 px-4 md:px-6 py-6 border-b border-muted"
		>
			<div className="flex items-center gap-4">
				<div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted shadow-inner border-2 border-primary/30">
					{avatarUrl ? (
						<Image
							src={avatarUrl}
							alt="Avatar"
							width={64}
							height={64}
							className="object-cover w-full h-full"
						/>
					) : (
						<div className="flex items-center justify-center w-full h-full text-xl font-bold text-muted-foreground">
							{initials}
						</div>
					)}
				</div>
				<div>
					<h2 className="text-xl font-semibold leading-tight">{name}</h2>
					<p className="text-muted-foreground text-sm">@{username}</p>
					<Badge className="mt-1" variant="secondary">
						{role}
					</Badge>
				</div>
			</div>

			<motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
				<Button
					size="sm"
					variant={isEditing ? "destructive" : "outline"}
					onClick={onEditToggle}
				>
					<Pencil className="w-4 h-4 mr-2" />
					{isEditing ? "Cancel" : "Edit Profile"}
				</Button>
			</motion.div>
		</motion.div>
	);
}
