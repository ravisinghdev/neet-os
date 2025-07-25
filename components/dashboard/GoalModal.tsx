"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { toast } from "sonner";

interface GoalModalProps {
	open: boolean;
	onClose: () => void;
}

export default function GoalModal({ open, onClose }: GoalModalProps) {
	const [newGoal, setNewGoal] = useState("");
	const [loading, setLoading] = useState(false);

	const handleAddGoal = async () => {
		if (!newGoal.trim()) return;

		setLoading(true);
		const { data: user } = await supabase.auth.getUser();
		const { error } = await supabase.from("goals").insert({
			user_id: user?.user?.id,
			goal: newGoal,
		});
		setLoading(false);

		if (error) {
			toast.error("Failed to add goal");
		} else {
			toast.success("Goal added");
			setNewGoal("");
			onClose();
		}
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Update Your Goals</DialogTitle>
					<DialogDescription>
						Add a new goal for your NEET preparation
					</DialogDescription>
				</DialogHeader>

				<Input
					value={newGoal}
					onChange={(e) => setNewGoal(e.target.value)}
					placeholder="e.g. Finish Electrostatics by Sunday"
					className="mt-4"
				/>

				<DialogFooter className="mt-4">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleAddGoal} disabled={!newGoal.trim() || loading}>
						{loading ? "Saving..." : "Save Goal"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
