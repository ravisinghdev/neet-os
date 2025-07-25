import { useSettings } from "@/hooks/useSettings";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

export function AiSettings() {
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
		isFieldChanged("show_ai_hint") ||
		isFieldChanged("ai_difficulty_level") ||
		isFieldChanged("enable_ai_study_plan") ||
		isFieldChanged("ai_avatar_enabled") ||
		isFieldChanged("enable_ai_test_analysis");

	const isAdaptive = settings.ai_difficulty_level === "adaptive";

	return (
		<Card className="rounded-2xl shadow-sm">
			<CardContent className="space-y-4 p-6">
				<h2 className="text-xl font-bold">🤖 AI Settings</h2>

				{/* Show AI Hints */}
				<div className="flex justify-between items-center">
					<Label>Enable AI Help</Label>
					<Switch
						checked={settings.show_ai_hint}
						onCheckedChange={(val) => updateSetting("show_ai_hint", val)}
					/>
				</div>

				{/* Enable AI Study Plan */}
				<div className="flex justify-between items-center">
					<Label>Auto Plan My Week</Label>
					<Switch
						checked={settings.enable_ai_study_plan}
						onCheckedChange={(val) =>
							updateSetting("enable_ai_study_plan", val)
						}
					/>
				</div>

				{/* Enable AI Test Analysis */}
				<div className="flex justify-between items-center">
					<Label>Smart Test Analysis</Label>
					<Switch
						checked={settings.enable_ai_test_analysis}
						onCheckedChange={(val) =>
							updateSetting("enable_ai_test_analysis", val)
						}
					/>
				</div>

				{/* AI Difficulty Adaptation */}
				<div className="flex justify-between items-center">
					<Label>Adjust Difficulty with Progress</Label>
					<Switch
						checked={isAdaptive}
						onCheckedChange={(val) =>
							updateSetting("ai_difficulty_level", val ? "adaptive" : "medium")
						}
					/>
				</div>

				{/* AI Avatar Option (Optional UI Support) */}
				<div className="flex justify-between items-center">
					<Label>AI Avatar Enabled</Label>
					<Switch
						checked={settings.ai_avatar_enabled}
						onCheckedChange={(val) => updateSetting("ai_avatar_enabled", val)}
					/>
				</div>
				{isDirty && (
					<div className="flex space-x-2 pt-2">
						<Button
							variant="default"
							onClick={() => {
								updateSetting("show_ai_hint", settings.show_ai_hint);
								updateSetting(
									"ai_difficulty_level",
									settings.ai_difficulty_level
								);
								updateSetting(
									"enable_ai_study_plan",
									settings.enable_ai_study_plan
								);
								updateSetting("ai_avatar_enabled", settings.ai_avatar_enabled);
								updateSetting(
									"enable_ai_test_analysis",
									settings.enable_ai_test_analysis
								);
							}}
						>
							{loading ? <Spinner /> : "Save"}
						</Button>
						<Button
							variant="outline"
							onClick={() => {
								resetField("show_ai_hint");
								resetField("ai_difficulty_level");
								resetField("enable_ai_study_plan");
								resetField("ai_avatar_enabled");
								resetField("enable_ai_test_analysis");
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
