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

export function PrivacySettings() {
	const { settings, updateSetting } = useSettings();

	if (!settings) return null;

	return (
		<Card className="rounded-2xl shadow-sm">
			<CardContent className="space-y-4 p-6">
				<h2 className="text-xl font-bold">🔐 Privacy Settings</h2>

				{/* Profile Visibility */}
				<div className="flex justify-between items-center">
					<Label>Profile Visibility</Label>
					<Select
						value={settings.profile_visibility}
						onValueChange={(val) => updateSetting("profile_visibility", val)}
					>
						<SelectTrigger className="w-36 capitalize">
							{settings.profile_visibility}
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="public">Public</SelectItem>
							<SelectItem value="private">Private</SelectItem>
							<SelectItem value="friends">Friends Only</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Leaderboard */}
				<div className="flex justify-between items-center">
					<Label>Show on Leaderboard</Label>
					<Switch
						checked={settings.allow_leaderboard}
						onCheckedChange={(val) => updateSetting("allow_leaderboard", val)}
					/>
				</div>

				{/* Friend Requests */}
				<div className="flex justify-between items-center">
					<Label>Allow Friend Requests</Label>
					<Switch
						checked={settings.allow_friend_requests}
						onCheckedChange={(val) =>
							updateSetting("allow_friend_requests", val)
						}
					/>
				</div>

				{/* In-App Chat */}
				<div className="flex justify-between items-center">
					<Label>Allow In-App Chat</Label>
					<Switch
						checked={settings.allow_chat}
						onCheckedChange={(val) => updateSetting("allow_chat", val)}
					/>
				</div>

				{/* Local Auto-Clear (frontend only) */}
				<div className="flex justify-between items-center">
					<Label>Clear Local Data on Logout</Label>
					<Switch
						onCheckedChange={() => localStorage.removeItem("neet-settings")}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
