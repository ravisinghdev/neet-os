import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // optional, if using shadcn's classnames helper

interface SpinnerProps {
	size?: number;
	className?: string;
}

export default function Spinner({ size = 24, className }: SpinnerProps) {
	return (
		<Loader2
			className={cn("animate-spin", className)}
			size={size}
			strokeWidth={2.5}
		/>
	);
}
