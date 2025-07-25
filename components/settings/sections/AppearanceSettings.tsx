import { useSettings } from "@/hooks/useSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

export function AppearanceSettings() {
	const {
		settings,
		updateField,
		resetField,
		updateSetting,
		isFieldChanged,
		loading,
	} = useSettings();

	if (!settings) return null;

	const isDirty =
		isFieldChanged("theme") ||
		isFieldChanged("font_size") ||
		isFieldChanged("compact_mode") ||
		isFieldChanged("dashboard_layout");

	return (
		<Card className="rounded-2xl shadow-sm">
			<CardContent className="space-y-4 p-6">
				<h2 className="text-xl font-bold">🖥 Appearance Settings</h2>

				{/* Theme */}
				<div className="flex justify-between items-center">
					<Label>Theme</Label>
					<Select
						value={settings.theme}
						onValueChange={(val) => updateField("theme", val)}
					>
						<SelectTrigger className="w-32 capitalize">
							{settings.theme}
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="light">Light</SelectItem>
							<SelectItem value="dark">Dark</SelectItem>
							<SelectItem value="system">System</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Font Size */}
				<div className="flex justify-between items-center">
					<Label>Font Size</Label>
					<Select
						value={settings.font_size}
						onValueChange={(val) => updateField("font_size", val)}
					>
						<SelectTrigger className="w-32 capitalize">
							{settings.font_size}
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="small">Small</SelectItem>
							<SelectItem value="medium">Medium</SelectItem>
							<SelectItem value="large">Large</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Compact Mode */}
				<div className="flex justify-between items-center">
					<Label>Compact Mode</Label>
					<Switch
						checked={settings.compact_mode}
						onCheckedChange={(val) => updateField("compact_mode", val)}
					/>
				</div>

				{/* Dashboard Layout */}
				<div className="flex justify-between items-center">
					<Label>Dashboard Layout</Label>
					<Select
						value={settings.dashboard_layout}
						onValueChange={(val) => updateField("dashboard_layout", val)}
					>
						<SelectTrigger className="w-32 capitalize">
							{settings.dashboard_layout}
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="default">Default</SelectItem>
							<SelectItem value="wide">Wide</SelectItem>
							<SelectItem value="minimal">Minimal</SelectItem>
						</SelectContent>
					</Select>
				</div>
				{isDirty && (
					<div className="flex space-x-2 pt-2">
						<Button
							variant="default"
							onClick={() => {
								updateSetting("theme", settings.theme);
								updateSetting("font_size", settings.font_size);
								updateSetting("dashboard_layout", settings.dashboard_layout);
								updateSetting("compact_mode", settings.compact_mode);
							}}
						>
							{loading ? <Spinner /> : "Save"}
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								resetField("theme");
								resetField("font_size");
								resetField("dashboard_layout");
								resetField("compact_mode");
							}}
						>
							Undo
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
