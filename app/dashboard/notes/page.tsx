"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase/supabase";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner"; // Optional loading spinner
import { getAllSubjects, getChaptersBySubject } from "@/lib/test/fetchOptions";

type Note = {
	id: string;
	user_id: string;
	subject: string;
	chapter: string;
	tags: string[];
	content: string;
	created_at?: string;
};

export default function MyNotesPage() {
	const [form, setForm] = useState({
		id: "",
		subject: "",
		chapter: "",
		tags: "",
		content: "",
	});
	const { profile } = useUserProfile();

	const [subjects, setSubjects] = useState<string[]>([]);
	const [chapters, setChapters] = useState<string[]>([]);
	const [notes, setNotes] = useState<Note[]>([]);
	// const [userId, setUserId] = useState<string>(profile.id);
	const [isLoading, setIsLoading] = useState(false);

	// Load subjects
	useEffect(() => {
		const fetchSubjects = async () => {
			try {
				const subjects = await getAllSubjects();
				setSubjects(subjects);
			} catch (error) {
				console.error("Error fetching subjects:", error);
			}
		};
		fetchSubjects();
	}, []);

	// Load chapters based on selected subject
	useEffect(() => {
		if (!form.subject) return;
		const fetchChapters = async () => {
			try {
				const chapters = await getChaptersBySubject(form.subject);
				setChapters(chapters);
			} catch (error) {
				console.error("Error fetching chapters:", error);
			}
		};
		fetchChapters();
	}, [form.subject]);

	const loadNotes = async (uid: string) => {
		const { data, error } = await supabase
			.from("notes")
			.select("*")
			.eq("user_id", uid)
			.order("created_at", { ascending: false });

		if (data) setNotes(data);
		if (error) console.error(error);
	};

	const resetForm = () => {
		setForm({ id: "", subject: "", chapter: "", tags: "", content: "" });
	};

	const saveNote = async () => {
		try {
			console.log("saveNote called");
			setIsLoading(true);

			// Log current form values
			console.log("Form:", form);
			console.log("User ID:", profile.id);

			// Validation with feedback
			if (
				!form.subject ||
				!form.chapter ||
				!form.content.trim() ||
				!profile.id
			) {
				toast("Please fill all fields", {
					description: "Subject, chapter, content are required",
				});
				setIsLoading(false);
				return;
			}

			const tagsArr = form.tags
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean);

			const payload = {
				user_id: profile.id,
				subject: form.subject,
				chapter: form.chapter,
				content: form.content,
				tags: tagsArr,
			};

			const { data, error } = await supabase
				.from("notes")
				.upsert({ ...(form.id && { id: form.id }), ...payload })
				.select()
				.single();

			if (error) {
				console.error("Supabase Error:", error.message);
				toast("Failed to save note", { description: error.message });
				return;
			}

			if (data) {
				console.log("Note saved:", data);
				setNotes((prev) => {
					const filtered = prev.filter((n) => n.id !== data.id);
					return [data as Note, ...filtered];
				});
				resetForm();
				toast("Note saved successfully");
			}
		} catch (err: any) {
			console.error("Exception:", err.message);
			toast("Failed to save note", { description: err.message });
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (note: Note) => {
		setForm({
			id: note.id,
			subject: note.subject,
			chapter: note.chapter,
			content: note.content,
			tags: note.tags.join(", "),
		});
	};

	return (
		<div className="max-w-4xl mx-auto w-full p-6 space-y-8">
			<div className="space-y-4">
				<h1 className="text-2xl font-bold">📒 My Notes</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label>Subject</Label>
						<Select
							value={form.subject}
							onValueChange={(val) => setForm((f) => ({ ...f, subject: val }))}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select Subject" />
							</SelectTrigger>
							<SelectContent>
								{subjects.map((s, i) => (
									<SelectItem key={i} value={s}>
										{s}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label>Chapter</Label>
						<Select
							value={form.chapter}
							onValueChange={(val) => setForm((f) => ({ ...f, chapter: val }))}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select Chapter" />
							</SelectTrigger>
							<SelectContent>
								{chapters.map((c, i) => (
									<SelectItem key={i} value={c}>
										{c}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div>
					<Label>Tags (comma separated)</Label>
					<Input
						value={form.tags}
						onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
						placeholder="revision, diagram, trick, etc."
					/>
				</div>

				<div>
					<Label>Note Content</Label>
					<Textarea
						rows={6}
						value={form.content}
						onChange={(e) =>
							setForm((f) => ({ ...f, content: e.target.value }))
						}
						placeholder="Write your note here..."
					/>
				</div>

				<Button onClick={saveNote}>
					{isLoading ? <Spinner /> : "Save Note"}
				</Button>
			</div>

			<hr className="my-6" />

			<div className="space-y-6">
				<h2 className="text-2xl font-bold tracking-tight">🗂️ Saved Notes</h2>

				{notes.length === 0 && (
					<p className="text-muted-foreground">No notes found.</p>
				)}

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{notes.map((note) => (
						<Card
							key={note.id}
							className="hover:shadow-md transition cursor-pointer"
							onClick={() => handleEdit(note)}
						>
							<CardHeader className="pb-2">
								<CardDescription className="text-sm text-muted-foreground">
									{note.subject} → {note.chapter}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-wrap gap-1 mt-2">
								<CardTitle className="text-base line-clamp-2 font-medium">
									{note.content}
								</CardTitle>
							</CardContent>
							<CardFooter>
								{note.tags?.length ? (
									note.tags.map((tag, i) => (
										<Badge key={i} variant="outline" className="text-xs">
											{tag}
										</Badge>
									))
								) : (
									<Badge variant="secondary" className="text-xs">
										No tags
									</Badge>
								)}
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
