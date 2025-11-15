import type { QuizData, CategoryQuestionsFile, Category } from '../types/quiz.types';

/**
 * Сервис для работы с данными викторины
 */
export class QuizDataService {
	private static readonly STORAGE_KEY = 'techQuizData';
	private static readonly VERSION_KEY = 'techQuizVersion';
	private static readonly CATEGORY_VERSION_PREFIX = 'techQuizCategoryVersion_';

	// Базовый URL до raw файлов в GitHub (индивидуальные файлы по категориям)
	private static readonly BASE_URL =
		'https://raw.githubusercontent.com/nkurbanoff/tech-quiz/main/public/data';

	// Список поддерживаемых категорий (метаданные)
	private static readonly CATEGORIES: Category[] = [
		{ id: 'csharp', name: 'C#', icon: '💻', color: 'bg-indigo-500' },
		{ id: 'angular', name: 'Angular', icon: '🅰️', color: 'bg-red-600' },
		{ id: 'postgres', name: 'PostgreSQL', icon: '🐘', color: 'bg-sky-600' },
		{ id: 'mssql', name: 'MS SQL', icon: '🗄️', color: 'bg-orange-600' },
	];

	/**
	 * Получает закэшированные данные из localStorage
	 */
	static getCachedData(): QuizData | null {
		try {
			const data = localStorage.getItem(this.STORAGE_KEY);
			if (!data) return null;
			return JSON.parse(data);
		} catch (error) {
			console.error('Ошибка при чтении кэша:', error);
			return null;
		}
	}

	/**
	 * Сохраняет данные в localStorage
	 */
	static saveData(data: QuizData): void {
		try {
			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
			localStorage.setItem(this.VERSION_KEY, data.version);
		} catch (error) {
			console.error('Ошибка при сохранении данных:', error);
		}
	}

	/**
	 * Загружает файл вопросов конкретной категории
	 */
	private static async fetchCategoryFile(categoryId: string): Promise<CategoryQuestionsFile> {
		const url = `${this.BASE_URL}/${categoryId}-questions.json`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Не удалось загрузить категорию ${categoryId}. Статус: ${response.status}`);
		}
		return (await response.json()) as CategoryQuestionsFile;
	}

	/**
	 * Загружает все категории и агрегирует в единую структуру QuizData
	 */
	static async fetchAllCategories(): Promise<QuizData> {
		try {
			const files: CategoryQuestionsFile[] = [];
			for (const cat of this.CATEGORIES) {
				const file = await this.fetchCategoryFile(cat.id);
				files.push(file);
				// сохраняем индивидуальную версию
				localStorage.setItem(
					this.CATEGORY_VERSION_PREFIX + cat.id,
					file.version
				);
			}

			const aggregated: QuizData = {
				version: this.composeGlobalVersion(files),
				lastUpdated: this.getMaxLastUpdated(files),
				categories: [...this.CATEGORIES],
				questions: files.reduce<Record<string, any>>((acc, f) => {
					acc[f.category] = f.questions;
					return acc;
				}, {}),
			};
			return aggregated;
		} catch (error) {
			console.error('Ошибка при загрузке категорий:', error);
			throw error;
		}
	}

	/**
	 * Составляет глобальную версию из версий категорий
	 */
	private static composeGlobalVersion(files: CategoryQuestionsFile[]): string {
		// Простая стратегия: конкатенация версий по категориям
		return files
			.map(f => `${f.category}@${f.version}`)
			.sort()
			.join('|');
	}

	/**
	 * Определяет максимальную дату обновления
	 */
	private static getMaxLastUpdated(files: CategoryQuestionsFile[]): string {
		return files
			.map(f => f.lastUpdated)
			.sort()
			.pop() || new Date().toISOString().substring(0, 10);
	}

	/**
	 * Проверяет наличие обновлений по любым категориям
	 */
	static async checkForUpdates(): Promise<boolean> {
		try {
			const files: CategoryQuestionsFile[] = [];
			for (const cat of this.CATEGORIES) {
				const file = await this.fetchCategoryFile(cat.id);
				files.push(file);
				const stored = localStorage.getItem(
					this.CATEGORY_VERSION_PREFIX + cat.id
				);
				if (!stored || stored !== file.version) {
					return true;
				}
			}
			return false;
		} catch (error) {
			console.error('Ошибка при проверке обновлений категорий:', error);
			return false;
		}
	}

	/**
	 * Инициализирует данные: проверяет кэш, при отсутствии использует дефолтные
	 */
	static async initializeData(defaultData: QuizData): Promise<QuizData> {
		const cached = this.getCachedData();
		if (cached) {
			// Фоновая проверка
			this.checkForUpdates().then(hasUpdates => {
				if (hasUpdates) {
					console.log('Доступны обновления категорий');
				}
			});
			return cached;
		}
		try {
			const remoteAggregated = await this.fetchAllCategories();
			this.saveData(remoteAggregated);
			return remoteAggregated;
		} catch {
			console.warn('Переход на локальные данные (fallback)');
			this.saveData(defaultData);
			return defaultData;
		}
	}

	/**
	 * Принудительное обновление данных с сервера
	 */
	static async forceUpdate(): Promise<QuizData> {
		const aggregated = await this.fetchAllCategories();
		this.saveData(aggregated);
		return aggregated;
	}

	/**
	 * Очищает кэш
	 */
	static clearCache(): void {
		localStorage.removeItem(this.STORAGE_KEY);
		localStorage.removeItem(this.VERSION_KEY);
	}
}
