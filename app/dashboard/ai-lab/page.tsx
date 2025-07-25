"use client";

import SmartPlanner from "@/components/ai/SmartPlanner";
import AISuggestions from "@/components/ai/AISuggestions";
import ProgressInsights from "@/components/ai/ProgressInsights";
import AINowHelper from "@/components/ai/AINowHelper";
import MotivationCard from "@/components/ai/MotivationCard";
import StudyHeatmap from "@/components/ai/StudyHeatmap";
import AIProgressGraph from "@/components/ai/AIProgressGraph";
import AIQuickActions from "@/components/ai/AIQuickActions";
import AITaskVoiceInput from "@/components/ai/AITaskVoiceInput";
import AIChatPortal from "@/components/ai/AIChatPortal";
import FocusBoosterCard from "@/components/ai/FocusBoosterCard";

import GlassCard from "@/components/ui/glass-card";

export default function AIDashboardPage() {
	return (
		<div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
			{/* Row 1: Planning + Suggestions */}
			<div className="grid md:grid-cols-2 gap-8">
				<GlassCard delay={0.1}>
					<SmartPlanner />
				</GlassCard>
				<GlassCard delay={0.2}>
					<AISuggestions />
				</GlassCard>
			</div>

			{/* Row 2: Graph + Heatmap */}
			<div className="grid md:grid-cols-2 gap-8">
				<GlassCard delay={0.3}>
					<AIProgressGraph />
				</GlassCard>
				<GlassCard delay={0.4}>
					<StudyHeatmap />
				</GlassCard>
			</div>

			{/* Row 3: Insights + Now Helper */}
			<div className="grid md:grid-cols-2 gap-8">
				<GlassCard delay={0.5}>
					<ProgressInsights />
				</GlassCard>
				<GlassCard delay={0.6}>
					<AINowHelper />
				</GlassCard>
			</div>

			{/* Row 4: Voice & Quick Actions */}
			<div className="grid md:grid-cols-2 gap-8">
				<GlassCard delay={0.7}>
					<AITaskVoiceInput />
				</GlassCard>
				<GlassCard delay={0.8}>
					<AIQuickActions />
				</GlassCard>
			</div>

			{/* Row 5: Motivation & Focus */}
			<div className="grid md:grid-cols-2 gap-8">
				<GlassCard delay={0.9}>
					<FocusBoosterCard />
				</GlassCard>
				<GlassCard delay={1.0}>
					<MotivationCard />
				</GlassCard>
			</div>

			{/* Floating Assistant (no card needed) */}
			<AIChatPortal />
		</div>
	);
}
