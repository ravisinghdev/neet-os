export function extractJsonFromText(text: string): any | null {
	try {
		const match = text.match(/\{[\s\S]*\}/);
		if (!match) return null;
		return JSON.parse(match[0]);
	} catch {
		return null;
	}
}
