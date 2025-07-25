"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
	mode: string;
	config?: any;
}

export function StartTestButton({ mode, config }: Props) {
	const router = useRouter();

	const handleStart = () => {
		const params = new URLSearchParams({ mode, ...config }).toString();
		router.push(`/test/start?${params}`);
	};

	return (
		<Button onClick={handleStart} className="mt-4">
			Start Test
		</Button>
	);
}
