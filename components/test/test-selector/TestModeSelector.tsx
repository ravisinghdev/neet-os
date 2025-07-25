"use client";

import { useEffect, useState } from "react";
import { allTestModes } from "./modes";
import { getAllSubjects, getChaptersBySubject } from "@/lib/test/fetchOptions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import GlassCard from "@/components/ui/glass-card";

export default function TestModeSelector() {
	const [selectedModeIndex, setSelectedModeIndex] = useState(0);
	const currentMode = allTestModes[selectedModeIndex];

	const [formData, setFormData] = useState<{ [key: string]: string }>({});
	const [subjects, setSubjects] = useState<string[]>([]);
	const [chapters, setChapters] = useState<string[]>([]);

	// Load all subjects when component mounts
	useEffect(() => {
		getAllSubjects().then(setSubjects);
	}, []);

	// Load chapters whenever subject changes
	useEffect(() => {
		const subject = formData["subject"];
		if (subject) getChaptersBySubject(subject).then(setChapters);
	}, [formData["subject"]]);

	const injectedFields = currentMode.fields.map((field) => {
		if (field.name === "subject") {
			return {
				...field,
				config: {
					...field.config,
					options: subjects,
				},
			};
		}
		if (field.name === "chapter") {
			return {
				...field,
				config: {
					...field.config,
					options: chapters,
				},
			};
		}
		return field;
	});

	const handleFieldChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="w-full max-w-6xl mx-auto md:px-10 flex flex-col md:flex-row gap-6">
			{/* Mode Selector */}
			<div className="w-full md:w-1/3 space-y-4">
				{allTestModes.map((mode, index) => (
					<GlassCard
						key={index}
						className={`cursor-pointer ${
							selectedModeIndex === index
								? "border-2 border-primary shadow-lg"
								: "hover:border-muted"
						}`}
						onClick={() => setSelectedModeIndex(index)}
					>
						<div className="font-semibold text-base">{mode.name}</div>
						<p className="text-sm text-muted-foreground">{mode.description}</p>
					</GlassCard>
				))}
			</div>

			{/* Dynamic Form */}
			<div className="w-full md:w-2/3 space-y-5">
				{injectedFields.map((field, idx) => (
					<div key={idx} className="space-y-2">
						<Label className="text-sm font-medium">{field.config.label}</Label>

						{field.config.type === "text" && (
							<Input
								value={formData[field.name] || ""}
								onChange={(e) => handleFieldChange(field.name, e.target.value)}
								placeholder={field.config.placeholder || ""}
							/>
						)}

						{field.config.type === "number" && (
							<Input
								type="number"
								value={formData[field.name] || ""}
								onChange={(e) => handleFieldChange(field.name, e.target.value)}
								placeholder={field.config.placeholder || ""}
							/>
						)}

						{field.config.type === "select" && (
							<Select
								value={formData[field.name] || ""}
								onValueChange={(val) => handleFieldChange(field.name, val)}
							>
								<SelectTrigger>
									<SelectValue placeholder={`Select ${field.config.label}`} />
								</SelectTrigger>
								<SelectContent>
									{field.config.options?.map((opt, i) => (
										<SelectItem key={i} value={opt}>
											{opt}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
