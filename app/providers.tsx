"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export interface ProvidersProps {
	children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	const router = useRouter();

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<TooltipProvider>{children}</TooltipProvider>
		</ThemeProvider>
	);
}
