import { Sparkles } from "lucide-react";
import { CardContainer } from "@/components/ui/CardContainer";
import { useUserProfile } from "@/hooks/useUserProfile";

export function ProfileAIInsights() {
	const { profile, loading } = useUserProfile();

	if (loading) return null;
	if (!profile) return null;

	const suggestions: string[] = [];

	if (profile.avg_score < 50) {
		suggestions.push(
			"Avg score < 50%. Focus on reviewing foundational topics."
		);
	} else if (profile.avg_score > 80) {
		suggestions.push(
			"🔥 Great work! Add timed mock tests to simulate exam conditions."
		);
	}

	if ((profile.strong_subjects?.length ?? 0) < 2) {
		suggestions.push(
			"Add at least 2 strong subjects so AI can tailor insights better."
		);
	}

	if (profile.sleep_time > "23:00") {
		suggestions.push(
			"Sleeping before 11 PM boosts memory—try adjusting your bedtime."
		);
	}

	return (
		<CardContainer>
			<h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
				<Sparkles size={20} className="text-indigo-400" />
				AI Insights
			</h2>
			<ul className="list-disc ml-6 space-y-2 text-sm text-muted-foreground">
				{suggestions.map((s, i) => (
					<li key={i}>{s}</li>
				))}
			</ul>
		</CardContainer>
	);
}
