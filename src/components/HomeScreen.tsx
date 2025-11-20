import React from 'react';
import { RefreshCw } from 'lucide-react';
import type { Category } from '../types/quiz.types';
import { ThemeToggle } from './ThemeToggle';

interface HomeScreenProps {
	categories: Category[];
	questionsCount: Record<string, number>;
	onStartQuiz: (categoryId: string) => void;
	onUpdateData: () => void;
}

/**
 * Главный экран с выбором категории
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({
	categories,
	questionsCount,
	onStartQuiz,
	onUpdateData,
}) => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-6 transition-colors">
			<ThemeToggle />
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">Tech Quiz</h1>
					<p className="text-slate-600 dark:text-slate-400">Выбери категорию для прохождения викторины</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
					{categories.map(cat => (
						<button
							key={cat.id}
							onClick={() => onStartQuiz(cat.id)}
							className={`${cat.color} p-4 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200`}
						>
							<div className="text-4xl mb-2">{cat.icon}</div>
							<div className="text-xl font-bold text-white mb-1">{cat.name}</div>
							<div className="text-white/90">
								{questionsCount[cat.id] || 0} вопросов
							</div>
						</button>
					))}
				</div>

				<button
					onClick={onUpdateData}
					className="w-full bg-white/80 dark:bg-slate-700 backdrop-blur-sm text-slate-700 dark:text-slate-100 p-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-slate-600 transition-all shadow-md hover:shadow-lg"
				>
					<RefreshCw size={20} />
					Обновить вопросы
				</button>
			</div>
		</div>
	);
};
