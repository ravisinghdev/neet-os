import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AppInfoSettings() {
	return (
		<Card className="rounded-2xl shadow-sm">
			<CardContent className="space-y-4 p-6">
				<h2 className="text-xl font-bold">ℹ️ App Info</h2>

				<div className="text-sm text-muted-foreground">
					<p>Version: 1.0.0</p>
					<p>Developer: NEET Dashboard Team</p>
				</div>

				<Button
					variant="outline"
					onClick={() => {
						localStorage.clear();
						window.location.reload();
					}}
				>
					Reset All Settings
				</Button>
			</CardContent>
		</Card>
	);
}
