import React, { useEffect } from 'react';
import { X, Award } from 'lucide-react';
import type { Category } from '../types/quiz.types';

interface ResultModalProps {
	category: Category;
	score: number;
	totalQuestions: number;
	onRetry: () => void;
	onGoHome: () => void;
	onClose: () => void;
}

/**
 * Модальное окно с результатами викторины
 */
export const ResultModal: React.FC<ResultModalProps> = ({
	category,
	score,
	totalQuestions,
	onRetry,
	onGoHome,
	onClose,
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

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [onClose]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/50" onClick={onClose} />
			<div className="relative z-10 w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl p-6">
				<button
					aria-label="Закрыть"
					onClick={onClose}
					className="absolute top-3 right-3 p-2 rounded-lg text-slate-500 hover:bg-slate-100"
				>
					<X size={20} />
				</button>

				<div className="text-center">
					<Award className="mx-auto text-amber-500 mb-2" size={56} />
					<h2 className="text-2xl font-bold text-slate-800 mb-1">Викторина завершена!</h2>
					<div className={`inline-block ${category.color} text-white px-3 py-1.5 rounded-lg mb-4`}>
						{category.icon} {category.name}
					</div>

					<div className="mb-6">
						<div className="text-5xl font-bold text-slate-700 mb-1">
							{score} / {totalQuestions}
						</div>
						<div className="text-xl text-slate-600">{percentage}% правильных ответов</div>
					</div>

					<p className={`text-lg font-semibold mb-6 ${message.color}`}>{message.text}</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<button
							onClick={() => {
								onClose();
								onRetry();
							}}
							className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white p-3.5 rounded-xl font-semibold hover:shadow-lg transition-all"
						>
							Пройти ещё раз
						</button>
						<button
							onClick={() => {
								onClose();
								onGoHome();
							}}
							className="w-full bg-slate-200 text-slate-800 p-3.5 rounded-xl font-semibold hover:bg-slate-300 transition-all"
						>
							На главную
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
