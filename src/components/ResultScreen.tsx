import React from 'react';
import { Award } from 'lucide-react';
import type { Category } from '../types/quiz.types';
import { ThemeToggle } from './ThemeToggle';

interface ResultScreenProps {
	category: Category;
	score: number;
	totalQuestions: number;
	onRetry: () => void;
	onGoHome: () => void;
}

/**
 * Экран результатов викторины
 */
export const ResultScreen: React.FC<ResultScreenProps> = ({
	category,
	score,
	totalQuestions,
	onRetry,
	onGoHome,
}) => {
	const percentage = Math.round((score / totalQuestions) * 100);

	const getMessage = () => {
		if (percentage === 100) {
			return { text: 'Отлично! Все ответы верные! 🏆', color: 'text-emerald-600' };
		}
		if (percentage >= 70) {
			return { text: 'Хороший результат! 👍', color: 'text-blue-600' };
		}
		if (percentage >= 50) {
			return { text: 'Неплохо, но есть куда расти! 📚', color: 'text-amber-600' };
		}
		return { text: 'Стоит повторить материал! 💪', color: 'text-red-600' };
	};

	const message = getMessage();

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-6 flex items-center justify-center transition-colors">
			<ThemeToggle />
			<div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 text-center transition-colors">
				<Award className="mx-auto text-amber-500 mb-4" size={80} />

				<h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Викторина завершена!</h2>
				<div className={`inline-block ${category.color} text-white px-4 py-2 rounded-lg mb-6`}>
					{category.icon} {category.name}
				</div>

				<div className="mb-8">
					<div className="text-6xl font-bold text-slate-700 dark:text-slate-200 mb-2">
						{score} / {totalQuestions}
					</div>
					<div className="text-2xl text-slate-600 dark:text-slate-400">
						{percentage}% правильных ответов
					</div>
				</div>

				<div className="mb-6">
					<p className={`text-xl font-semibold ${message.color} dark:text-slate-100`}>
						{message.text}
					</p>
				</div>

				<div className="flex gap-4">
					<button
						onClick={onRetry}
						className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all"
					>
						Пройти ещё раз
					</button>
					<button
						onClick={onGoHome}
						className="flex-1 bg-slate-200 text-slate-800 p-4 rounded-xl font-semibold hover:bg-slate-300 transition-all"
					>
						На главную
					</button>
				</div>
			</div>
		</div>
	);
};
