"use client";
import UploadForm from "@/components/UploadForm";

export default function UploadPage() {
	return (
		<div className="max-w-2xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Upload Questions</h1>
			<UploadForm />
		</div>
	);
}
