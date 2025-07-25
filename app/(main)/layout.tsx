import FooterSection from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar />
			{children}
			<FooterSection />
		</>
	);
}
