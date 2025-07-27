"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ProfileFieldProps {
	label: string;
	field: string;
	value: any;
	editMode: boolean;
	onChange: (field: string, value: any) => void;
	isChanged?: boolean;
	type?: string;
	placeholder?: string;
}

export const ProfileField = ({
	label,
	field,
	value,
	editMode,
	onChange,
	isChanged = false,
	type = "text",
	placeholder,
}: ProfileFieldProps) => {
	return (
		<div className="flex flex-col space-y-1">
			<Label className="text-sm text-muted-foreground">{label}</Label>
			{editMode ? (
				<Input
					type={type}
					value={value || ""}
					placeholder={placeholder}
					className={cn(
						"transition-all",
						isChanged && "ring-2 ring-yellow-500"
					)}
					onChange={(e) => onChange(field, e.target.value)}
				/>
			) : (
				<p className="text-sm text-foreground">{value || "—"}</p>
			)}
		</div>
	);
};
