/**
 * Уровень сложности вопроса
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Структура вопроса викторины
 */
export interface Question {
	/** Уникальный идентификатор вопроса */
	id: number;
	/** Текст вопроса */
	question: string;
	/** Варианты ответов (4 варианта) */
	options: string[];
	/** Индекс правильного ответа (0-3) */
	correct: number;
	/** Объяснение правильного ответа */
	explanation: string;
	/** Уровень сложности (опционально) */
	difficulty?: DifficultyLevel;
	/** Теги для фильтрации (опционально) */
	tags?: string[];
}

/**
 * Категория викторины
 */
export interface Category {
	/** Уникальный идентификатор категории */
	id: string;
	/** Название категории */
	name: string;
	/** Эмодзи иконка */
	icon: string;
	/** CSS класс цвета (Tailwind) */
	color: string;
}

/**
 * Полная структура данных викторины
 */
export interface QuizData {
	/** Версия данных для отслеживания обновлений */
	version: string;
	/** Дата последнего обновления */
	lastUpdated: string;
	/** Список доступных категорий */
	categories: Category[];
	/** Вопросы, сгруппированные по категориям */
	questions: Record<string, Question[]>;
}

/**
 * Структура отдельного файла вопросов по категории
 */
export interface CategoryQuestionsFile {
	/** Версия набора вопросов категории */
	version: string;
	/** Дата последнего обновления */
	lastUpdated: string;
	/** Идентификатор категории */
	category: string;
	/** Список вопросов категории */
	questions: Question[];
}

/**
 * Статистика прохождения викторины
 */
export interface QuizStats {
	/** ID категории */
	categoryId: string;
	/** Количество правильных ответов */
	score: number;
	/** Общее количество вопросов */
	total: number;
	/** Дата прохождения */
	date: string;
}
