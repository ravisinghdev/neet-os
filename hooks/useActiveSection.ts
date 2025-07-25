import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[]) {
	const [active, setActive] = useState(sectionIds[0]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.find((e) => e.isIntersecting);
				if (visible) setActive(visible.target.id);
			},
			{ rootMargin: "-40% 0px -50% 0px", threshold: 0.1 }
		);

		sectionIds.forEach((id) => {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		});

		return () => observer.disconnect();
	}, [sectionIds]);

	return active;
}
