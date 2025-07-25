import { DBTestResult } from "./db";

export interface MCQRequestBody {
	topic: string;
}

export interface MCQResponse {
	mcqs: string;
}

export interface PlanRequestBody {
	testResults: DBTestResult[];
}

export interface PlanResponse {
	plan: string;
}

export interface WhatNowRequestBody {
	userId: string;
}

export interface WhatNowResponse {
	tip: string;
}

export interface AIPlanRequest {
	userId: string;
	goals?: string[];
}

export interface AISuggestion {
	subject: string;
	weakTopic: string;
	recommendation: string;
}

export interface AIAnalyzerResult {
	strengths: string[];
	weaknesses: string[];
	advice: string;
}
