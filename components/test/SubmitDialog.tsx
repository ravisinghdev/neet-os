"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export interface SubmitDialogProps {
	open: boolean;
	onConfirm: () => Promise<void>;
	onClose: () => void; // ✅ add this if your design uses onClose
}

export default function SubmitDialog({
	open,
	onConfirm,
	onClose,
}: SubmitDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-sm border border-muted rounded-2xl p-6">
				<DialogHeader>
					<div className="flex items-center gap-2">
						<CheckCircle2 className="text-green-600" size={22} />
						<DialogTitle className="text-lg">Submit Test?</DialogTitle>
					</div>
					<DialogDescription className="text-sm text-muted-foreground mt-2">
						Are you sure you want to submit this test? You won’t be able to
						change your answers after this.
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="flex justify-end gap-3 mt-4">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={onConfirm}>Submit Test</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
