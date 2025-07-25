import { useMemo } from "react";

export function useCurrentQuestion<T = any>(questions: T[], currentQ: number) {
	const question = useMemo(() => {
		if (!Array.isArray(questions)) return undefined;
		if (currentQ < 0 || currentQ >= questions.length) return undefined;
		return questions[currentQ];
	}, [questions, currentQ]);

	return {
		question,
		isValid: !!question,
		isFirst: currentQ === 0,
		isLast: currentQ === questions.length - 1,
	};
}
