"use client";

import { UploadCloud, File, Loader2, Brain, History } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ImportQuestionsPage() {
	const [file, setFile] = useState<File | null>(null);
	const [subject, setSubject] = useState("biology");
	const [grade, setGrade] = useState("11");
	const [useAI, setUseAI] = useState(true);
	const [extracted, setExtracted] = useState<string>("");
	const [loading, setLoading] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFile(e.target.files?.[0] || null);
	};

	const handleSubmit = async () => {
		if (!file) return toast.error("Please upload a file");
		setLoading(true);

		const formData = new FormData();
		formData.append("file", file);
		formData.append("subject", subject);
		formData.append("grade", grade);
		formData.append("useAI", String(useAI));

		try {
			const res = await fetch("/api/tools/import-questions", {
				method: "POST",
				body: formData,
			});
			const data = await res.json();
			setExtracted(JSON.stringify(data, null, 2));
			toast.success("Extraction complete!");
		} catch (err) {
			toast.error("Failed to extract questions.");
		} finally {
			setLoading(false);
		}
	};

	const uploadFile = async (file: File) => {
		const form = new FormData();
		form.append("file", file);

		const res = await fetch("http://localhost:8000/upload/", {
			method: "POST",
			body: form,
		});

		const data = await res.json();
		console.log("✅ Upload result", data);
	};

	return (
		<div className="p-8 space-y-6 max-w-5xl mx-auto">
			<h2 className="text-3xl font-bold flex items-center gap-2">
				<UploadCloud /> Import Questions
			</h2>

			<Card>
				<CardContent className="p-6 grid gap-4 md:grid-cols-2">
					<div className="space-y-4">
						<Input
							type="file"
							accept=".pdf,.jpg,.png,.jpeg,.json,.docx"
							onChange={handleFileChange}
						/>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label>Class</Label>
								<select
									className="w-full border rounded px-3 py-2"
									value={grade}
									onChange={(e) => setGrade(e.target.value)}
								>
									<option value="11">Class 11</option>
									<option value="12">Class 12</option>
								</select>
							</div>
							<div>
								<Label>Subject</Label>
								<select
									className="w-full border rounded px-3 py-2"
									value={subject}
									onChange={(e) => setSubject(e.target.value)}
								>
									<option value="biology">Biology</option>
									<option value="physics">Physics</option>
									<option value="chemistry">Chemistry</option>
								</select>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex gap-2 items-center">
								<Brain className="text-green-600" />
								<Label>Use AI to generate explanation</Label>
							</div>
							<Switch checked={useAI} onCheckedChange={setUseAI} />
						</div>
						<Button
							onClick={handleSubmit}
							disabled={loading}
							className="w-full text-lg"
						>
							{loading ? (
								<Loader2 className="animate-spin mr-2" />
							) : (
								<File className="mr-2" />
							)}
							{loading ? "Extracting..." : "Extract Questions"}
						</Button>
					</div>

					<div className="p-4 border rounded max-h-[400px] overflow-y-auto">
						<Label className="mb-2 block text-muted-foreground">
							Extracted Questions Preview
						</Label>
						<Textarea value={extracted} readOnly className="min-h-[300px]" />
					</div>
				</CardContent>
			</Card>

			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<History className="w-4 h-4" />
				Import History coming soon…
			</div>
		</div>
	);
}
