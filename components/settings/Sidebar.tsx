import { cn } from "@/lib/utils";

const sections = [
	{ id: "appearance", label: "🖥 Appearance" },
	{ id: "ai", label: "🤖 AI Settings" },
	{ id: "notifications", label: "🔔 Notifications" },
	{ id: "privacy", label: "🔐 Privacy" },
	{ id: "test", label: "🧪 Test Defaults" },
	{ id: "info", label: "ℹ️ App Info" },
];

export function SettingsSidebar({ active }: { active: string }) {
	return (
		<aside className="w-64 p-4 sticky top-0 self-start border-r">
			<h2 className="text-xl font-bold mb-4">Settings</h2>
			<nav className="space-y-2">
				{sections.map((section) => (
					<a
						key={section.id}
						href={`#${section.id}`}
						className={cn(
							"block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition",
							active === section.id
								? "bg-muted text-primary font-bold"
								: "text-muted-foreground"
						)}
					>
						{section.label}
					</a>
				))}
			</nav>
		</aside>
	);
}
