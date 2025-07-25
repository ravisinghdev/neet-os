import "@/styles/globals.css";
import { Viewport } from "next";
import clsx from "clsx";
import { Inter } from "next/font/google";

import { Providers } from "./providers";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "NEET Practice App",
	description: "Smart test prep for NEET Biology",
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html suppressHydrationWarning lang="en">
			<head />
			<body
				className={clsx(
					"min-h-screen dark:bg-black font-segoe antialiased",
					inter.className
				)}
			>
				<Providers>
					<div className="relative flex flex-col h-screen">
						<main className="container mx-auto max-w-7xl flex-grow">
							<AuthProvider>{children}</AuthProvider>
						</main>
						<Toaster />
					</div>
				</Providers>
			</body>
		</html>
	);
}
