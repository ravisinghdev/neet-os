// components/UploadForm.tsx
"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/supabase";

export default function UploadForm() {
	const [jsonText, setJsonText] = useState("");
	const [status, setStatus] = useState("");

	const handleUpload = async () => {
		try {
			const parsed = JSON.parse(jsonText);
			let count = 0;
			for (let q of parsed) {
				const { error } = await supabase.from("questions").insert([q]);
				if (!error) count++;
			}
			setStatus(`✅ Uploaded ${count} questions.`);
		} catch (e) {
			setStatus("❌ Invalid JSON or upload failed.");
		}
	};

	return (
		<div className="space-y-4">
			<textarea
				className="w-full h-64 p-2 border rounded"
				value={jsonText}
				onChange={(e) => setJsonText(e.target.value)}
				placeholder="Paste JSON here..."
			/>
			<button
				onClick={handleUpload}
				className="bg-blue-600 text-white px-4 py-2 rounded"
			>
				Upload Questions
			</button>
			<div className="text-sm text-muted">{status}</div>
		</div>
	);
}
