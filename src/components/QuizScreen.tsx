import React from 'react';
import { Home, CheckCircle, XCircle } from 'lucide-react';
import type { Question, Category } from '../types/quiz.types';

interface QuizScreenProps {
	category: Category;
	currentQuestion: Question;
	currentQuestionIndex: number;
	totalQuestions: number;
	score: number;
	showExplanation: boolean;
	selectedAnswer: number | null;
	isCorrect: boolean;
	onAnswer: (answerIndex: number) => void;
	onNext: () => void;
	onGoHome: () => void;
}

/**
 * Экран викторины с вопросами
 */
export const QuizScreen: React.FC<QuizScreenProps> = ({
	category,
	currentQuestion,
	currentQuestionIndex,
	totalQuestions,
	score,
	showExplanation,
	selectedAnswer,
	isCorrect,
	onAnswer,
	onNext,
	onGoHome,
}) => {
	const correctIndex = currentQuestion.correct;
	const correctLetter = String.fromCharCode(65 + correctIndex);
	const correctText = currentQuestion.options[correctIndex];
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
			<div className="max-w-3xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<button
						onClick={onGoHome}
						className="bg-white/80 backdrop-blur-sm text-slate-700 p-3 rounded-xl hover:bg-white transition-all shadow-md"
					>
						<Home size={24} />
					</button>
					<div className="text-slate-700 text-lg font-semibold">
						Вопрос {currentQuestionIndex + 1} из {totalQuestions}
					</div>
					<div className="text-slate-700 text-lg font-semibold">
						Счёт: {score}
					</div>
				</div>

				<div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
					<div className={`inline-block ${category.color} text-white px-4 py-2 rounded-lg mb-4`}>
						{category.icon} {category.name}
					</div>

					<h2 className="text-2xl font-bold text-slate-800 mb-6">
						{currentQuestion.question}
					</h2>

					<div className="space-y-3">
						{currentQuestion.options.map((option, index) => (
							<button
								key={index}
								onClick={() => !showExplanation && onAnswer(index)}
								disabled={showExplanation}
								className={`w-full p-4 rounded-xl text-left transition-all ${showExplanation
									? index === currentQuestion.correct
										? 'bg-emerald-50 border-2 border-emerald-500'
										: selectedAnswer === index
											? 'bg-red-50 border-2 border-red-500'
											: 'bg-slate-50'
									: 'bg-slate-50 hover:bg-slate-100 hover:shadow-md'
									}`}
							>
								<div className="flex items-center gap-3">
									<span className="font-bold text-slate-600">
										{String.fromCharCode(65 + index)}.
									</span>
									<span className="text-slate-800">{option}</span>
								</div>
							</button>
						))}
					</div>
				</div>

				{showExplanation && (
					<div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
						<div className="flex items-center gap-3 mb-4">
							{isCorrect ? (
								<>
									<CheckCircle className="text-emerald-600" size={32} />
									<h3 className="text-2xl font-bold text-emerald-600">Правильно! 🎉</h3>
								</>
							) : (
								<>
									<XCircle className="text-red-600" size={32} />
									<h3 className="text-2xl font-bold text-red-600">Неправильно</h3>
								</>
							)}
						</div>

						<p className="text-slate-700 leading-relaxed mb-4">
							{currentQuestion.explanation}
						</p>

						{!isCorrect && (
							<div className="text-slate-700 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
								<div className="font-semibold mb-1">Правильный ответ:</div>
								<div>
									<span className="font-bold text-slate-800">{correctLetter}.</span>
									<span className="ml-2 text-slate-800">{correctText}</span>
								</div>
							</div>
						)}

						<button
							onClick={onNext}
							className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4 rounded-xl font-semibold hover:shadow-lg transition-all"
						>
							{currentQuestionIndex < totalQuestions - 1 ? 'Следующий вопрос' : 'Завершить'}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
