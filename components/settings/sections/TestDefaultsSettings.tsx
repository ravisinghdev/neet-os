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

export function TestDefaultsSettings() {
	const { settings, updateSetting } = useSettings();

	if (!settings) return null;

	return (
		<Card className="rounded-2xl shadow-sm">
			<CardContent className="space-y-4 p-6">
				<h2 className="text-xl font-bold">🧪 Test Preferences</h2>

				{/* Test Duration */}
				<div className="flex justify-between items-center">
					<Label>Default Test Duration</Label>
					<Select
						value={String(settings.default_test_duration_minutes)}
						onValueChange={(val) =>
							updateSetting("default_test_duration_minutes", parseInt(val))
						}
					>
						<SelectTrigger className="w-32 capitalize">
							{settings.default_test_duration_minutes} min
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="30">30 Minutes</SelectItem>
							<SelectItem value="45">45 Minutes</SelectItem>
							<SelectItem value="60">1 Hour</SelectItem>
							<SelectItem value="90">1.5 Hours</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Auto Submit */}
				<div className="flex justify-between items-center">
					<Label>Auto-Submit on Time Up</Label>
					<Switch
						checked={settings.auto_submit_on_timeout}
						onCheckedChange={(val) =>
							updateSetting("auto_submit_on_timeout", val)
						}
					/>
				</div>

				{/* Daily Test Reminder */}
				<div className="flex justify-between items-center">
					<Label>Daily Test Reminder</Label>
					<Switch
						checked={settings.daily_test_reminder}
						onCheckedChange={(val) => updateSetting("daily_test_reminder", val)}
					/>
				</div>

				{/* Question Discussion */}
				<div className="flex justify-between items-center">
					<Label>Enable Question Discussion</Label>
					<Switch
						checked={settings.enable_question_discussion}
						onCheckedChange={(val) =>
							updateSetting("enable_question_discussion", val)
						}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
