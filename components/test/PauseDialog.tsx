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
import { PauseCircle } from "lucide-react";

interface PauseDialogProps {
	open: boolean;
	onClose: () => void;
	onResume: () => void;
}
export default function PauseDialog({
	open,
	onResume,
	onClose,
}: PauseDialogProps) {
	return (
		<Dialog open={open}>
			<DialogContent className="max-w-sm border border-muted rounded-2xl p-6">
				<DialogHeader>
					<div className="flex items-center gap-2">
						<PauseCircle className="text-muted-foreground" size={22} />
						<DialogTitle className="text-lg">Test Paused</DialogTitle>
					</div>
					<DialogDescription className="text-sm text-muted-foreground mt-2">
						You’ve paused the test. Don’t take too long, timer will not stop!
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="flex justify-end gap-3 mt-4">
					<Button variant="outline" onClick={onClose}>
						Quit Test
					</Button>
					<Button onClick={onResume}>Resume</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
