export function CardContainer({ children }: { children: React.ReactNode }) {
	return (
		<div className="rounded-xl border border-white/10 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition-all duration-300">
			{children}
		</div>
	);
}
