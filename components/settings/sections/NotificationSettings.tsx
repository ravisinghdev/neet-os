import { useSettings } from "@/hooks/useSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

export function NotificationSettings() {
	const {
		settings,
		updateField,
		resetField,
		isFieldChanged,
		loading,
		updateSetting,
	} = useSettings();

	if (!settings) return null;

	const isDirty =
		isFieldChanged("daily_test_reminder") ||
		isFieldChanged("push_notifications") ||
		isFieldChanged("email_notifications") ||
		isFieldChanged("notify_progress_weekly") ||
		isFieldChanged("notify_daily_test");

	return (
		<Card className="rounded-2xl shadow-sm">
			<CardContent className="space-y-4 p-6">
				<h2 className="text-xl font-bold">🔔 Notifications</h2>

				<div className="flex justify-between items-center">
					<Label>Daily Study Reminder</Label>
					<Switch
						checked={settings.notify_daily_test}
						onCheckedChange={(val) => updateField("notify_daily_test", val)}
					/>
				</div>

				<div className="flex justify-between items-center">
					<Label>Streak Break Warning</Label>
					<Switch
						checked={settings.notify_streak_loss}
						onCheckedChange={(val) => updateField("notify_streak_loss", val)}
					/>
				</div>

				<div className="flex justify-between items-center">
					<Label>Weekly Progress Report</Label>
					<Switch
						checked={settings.notify_progress_weekly}
						onCheckedChange={(val) =>
							updateField("notify_progress_weekly", val)
						}
					/>
				</div>

				<div className="flex justify-between items-center">
					<Label>Email Notifications</Label>
					<Switch
						checked={settings.email_notifications}
						onCheckedChange={(val) => updateField("email_notifications", val)}
					/>
				</div>

				<div className="flex justify-between items-center">
					<Label>Push Notifications</Label>
					<Switch
						checked={settings.push_notifications}
						onCheckedChange={(val) => updateField("push_notifications", val)}
					/>
				</div>
				{isDirty && (
					<div className="flex space-x-2 pt-2">
						<Button
							variant="default"
							onClick={() => {
								updateSetting(
									"daily_test_reminder",
									settings.daily_test_reminder
								);
								updateSetting(
									"push_notifications",
									settings.push_notifications
								);
								updateSetting(
									"email_notifications",
									settings.email_notifications
								);
								updateSetting(
									"notify_progress_weekly",
									settings.notify_progress_weekly
								);
								updateField("notify_daily_test", settings.notify_daily_test);
							}}
						>
							{loading ? <Spinner /> : "Save"}
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								resetField("daily_test_reminder");
								resetField("push_notifications");
								resetField("email_notifications");
								resetField("notify_progress_weekly");
								resetField("notify_daily_test");
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
