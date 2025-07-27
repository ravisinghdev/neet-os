import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function NotificationDropdown({
	notifications = [],
}: {
	notifications?: Array<{
		id: string;
		title: string;
		description: string;
		time?: string;
	}>;
}) {
	const unreadCount = notifications.length;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="relative hover:text-foreground text-muted-foreground">
					<Bell size={20} />
					{unreadCount > 0 && (
						<span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-md">
							{unreadCount}
						</span>
					)}
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-80">
				<DropdownMenuLabel className="flex justify-between items-center">
					<span>🔔 Notifications</span>
					{unreadCount > 0 && (
						<Badge variant="outline" className="text-xs">
							{unreadCount} new
						</Badge>
					)}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{notifications.length === 0 ? (
					<div className="text-center text-muted-foreground px-4 py-8 text-sm">
						No new notifications.
					</div>
				) : (
					notifications.map((n) => (
						<DropdownMenuItem
							key={n.id}
							className="flex flex-col items-start gap-1"
						>
							<p className="text-sm font-medium">{n.title}</p>
							<p className="text-xs text-muted-foreground">{n.description}</p>
							{n.time && (
								<span className="text-[10px] text-muted-foreground mt-1">
									{n.time}
								</span>
							)}
						</DropdownMenuItem>
					))
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
