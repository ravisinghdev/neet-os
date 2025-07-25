// utils/api.ts
import axios from "axios";
import { Test, TestMode } from "@/types/test";

export const api = {
	createTest: (test: TestMode) => axios.post<Test>("/api/test/create", test),
	getAllTests: () => axios.get<{ tests: Test[] }>("/api/test/list"),
	getTest: (id: string) => axios.get<Test>(`/api/test/${id}`),
	updateTest: (id: string, updates: Partial<TestMode>) =>
		axios.put<Test>(`/api/test/${id}`, updates),
	deleteTest: (id: string) => axios.delete(`/api/test/${id}`),
};
