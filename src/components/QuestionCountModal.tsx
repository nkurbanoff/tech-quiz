import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';

interface QuestionCountModalProps {
	maxCount: number;
	onConfirm: (count: number) => void;
	onCancel: () => void;
}

/**
 * Модальное окно выбора количества вопросов перед стартом викторины
 */
export const QuestionCountModal: React.FC<QuestionCountModalProps> = ({
	maxCount,
	onConfirm,
	onCancel,
}) => {
	const presets = useMemo(() => {
		const base = [5, 10, 15, 20];
		return base.filter(x => x <= maxCount);
	}, [maxCount]);

	const [value, setValue] = useState<string>(() => {
		if (maxCount >= 10) return '10';
		if (maxCount >= 5) return '5';
		return String(Math.max(1, maxCount));
	});

	const clamp = (n: number) => Math.max(1, Math.min(maxCount, Math.floor(n)));

	const handleChange = (raw: string) => {
		if (raw === '') {
			setValue('');
			return;
		}
		const num = Number(raw);
		if (Number.isNaN(num)) return; // игнор нечислового
		setValue(String(clamp(num)));
	};

	const handleConfirm = () => {
		const num = Number(value);
		const final = Number.isNaN(num) ? 1 : clamp(num);
		onConfirm(final);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/50" onClick={onCancel} />
			<div className="relative z-10 w-full max-w-md mx-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 transition-colors">
				<button
					aria-label="Закрыть"
					onClick={onCancel}
					className="absolute top-3 right-3 p-2 rounded-lg text-slate-500 hover:bg-slate-100"
				>
					<X size={20} />
				</button>

				<h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Сколько вопросов пройти?</h3>
				<p className="text-slate-600 dark:text-slate-400 mb-4">Доступно вопросов: {maxCount}</p>

				<div className="grid grid-cols-4 gap-2 mb-4">
					{presets.map(p => (
						<button
							key={p}
							onClick={() => setValue(String(p))}
							className={`p-2 rounded-lg text-sm font-semibold border ${value === String(p) ? 'bg-slate-800 text-white border-slate-800' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600'
								}`}
						>
							{p}
						</button>
					))}
				</div>

				<div className="flex items-center gap-3 mb-6">
					<input
						type="text"
						inputMode="numeric"
						pattern="[0-9]*"
						min={1}
						max={maxCount}
						value={value}
						onChange={e => handleChange(e.target.value)}
						onBlur={() => { if (value === '') setValue('1'); }}
						className="w-32 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700"
					/>
					<div className="text-slate-500 dark:text-slate-400 text-sm">от 1 до {maxCount}</div>
				</div>

				<button
					onClick={handleConfirm}
					className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white p-3.5 rounded-xl font-semibold hover:shadow-lg transition-all"
				>
					Начать
				</button>
			</div>
		</div>
	);
};
