import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { QuizDataService } from './services/QuizDataService';
import { ResultModal } from './components/ResultModal';
import { QuestionCountModal } from './components/QuestionCountModal';
import { ThemeToggle } from './components/ThemeToggle';
import type { QuizData, Question } from './types/quiz.types';

type Screen = 'home' | 'quiz';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionQuestions, setSessionQuestions] = useState<Question[] | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showCountModal, setShowCountModal] = useState(false);
  const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(null);

  // Fisher–Yates shuffle
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Перемешивание вариантов ответа с пересчётом индекса correct
  const shuffleQuestionOptions = (q: Question): Question => {
    const withIndex = q.options.map((opt, idx) => ({ opt, originalIndex: idx }));
    const shuffled = shuffleArray(withIndex);
    const newOptions = shuffled.map(x => x.opt);
    const newCorrect = shuffled.findIndex(x => x.originalIndex === q.correct);
    return { ...q, options: newOptions, correct: newCorrect };
  };

  // Дефолтные данные (используются как fallback)
  const defaultData: QuizData = {
    version: '1.0.0',
    lastUpdated: '2025-11-15',
    categories: [
      { id: 'csharp', name: 'C#', icon: '💻', color: 'bg-indigo-500' },
      { id: 'angular', name: 'Angular', icon: '🅰️', color: 'bg-red-600' },
      { id: 'postgres', name: 'PostgreSQL', icon: '🐘', color: 'bg-sky-600' },
      { id: 'mssql', name: 'MS SQL', icon: '🗄️', color: 'bg-orange-600' }
    ],
    questions: {
      csharp: [
        {
          id: 1,
          question: 'Что такое LINQ в C#?',
          options: [
            'Language Integrated Query - встроенный язык запросов',
            'Linear Query - линейный запрос',
            'Link Query - связанный запрос',
            'List Query - запрос к спискам'
          ],
          correct: 0,
          explanation: 'LINQ (Language Integrated Query) - это технология в .NET, которая позволяет выполнять запросы к различным источникам данных (коллекции, БД, XML) используя единообразный синтаксис прямо в коде C#.'
        },
        {
          id: 2,
          question: 'Какой модификатор доступа используется по умолчанию для членов класса?',
          options: ['public', 'private', 'protected', 'internal'],
          correct: 1,
          explanation: 'По умолчанию члены класса в C# имеют модификатор доступа private, что означает доступ только внутри класса. Это соответствует принципу инкапсуляции.'
        },
        {
          id: 3,
          question: 'Что делает ключевое слово async?',
          options: [
            'Делает метод синхронным',
            'Позволяет использовать await внутри метода',
            'Автоматически запускает метод в новом потоке',
            'Блокирует выполнение до завершения операции'
          ],
          correct: 1,
          explanation: 'Ключевое слово async указывает, что метод является асинхронным и может содержать операторы await. Это не создаёт новый поток автоматически, а позволяет освободить текущий поток во время ожидания.'
        }
      ],
      angular: [
        {
          id: 1,
          question: 'Что такое директива в Angular?',
          options: [
            'Компонент без шаблона',
            'Класс, который изменяет поведение элементов DOM',
            'Сервис для работы с HTTP',
            'Модуль для роутинга'
          ],
          correct: 1,
          explanation: 'Директива в Angular - это класс с декоратором @Directive, который добавляет дополнительное поведение к элементам DOM. Существуют структурные (*ngIf, *ngFor) и атрибутные директивы.'
        },
        {
          id: 2,
          question: 'Для чего используется RxJS в Angular?',
          options: [
            'Для стилизации компонентов',
            'Для работы с асинхронными потоками данных',
            'Для тестирования приложения',
            'Для компиляции TypeScript'
          ],
          correct: 1,
          explanation: 'RxJS (Reactive Extensions for JavaScript) используется для работы с асинхронными потоками данных через Observables. В Angular он применяется в HTTP-запросах, формах, событиях и роутинге.'
        },
        {
          id: 3,
          question: 'Что такое Angular CLI?',
          options: [
            'Библиотека для UI компонентов',
            'Инструмент командной строки для разработки',
            'Система управления состоянием',
            'Фреймворк для тестирования'
          ],
          correct: 1,
          explanation: 'Angular CLI (Command Line Interface) - это инструмент командной строки для создания, разработки, тестирования и деплоя Angular приложений. Команды: ng new, ng serve, ng build, ng test и др.'
        }
      ],
      postgres: [
        {
          id: 1,
          question: 'Какой тип данных в PostgreSQL используется для автоинкремента?',
          options: ['AUTO_INCREMENT', 'SERIAL', 'IDENTITY', 'SEQUENCE'],
          correct: 1,
          explanation: 'В PostgreSQL используется тип SERIAL (или BIGSERIAL для больших значений), который автоматически создаёт последовательность (sequence) и использует её для генерации уникальных значений.'
        },
        {
          id: 2,
          question: 'Что такое VACUUM в PostgreSQL?',
          options: [
            'Команда для удаления таблицы',
            'Процесс очистки и оптимизации базы данных',
            'Создание резервной копии',
            'Блокировка таблицы'
          ],
          correct: 1,
          explanation: 'VACUUM - это процесс в PostgreSQL, который освобождает пространство, занятое "мёртвыми" строками после UPDATE/DELETE операций. VACUUM FULL дополнительно дефрагментирует таблицу.'
        },
        {
          id: 3,
          question: 'Какой уровень изоляции транзакций используется по умолчанию?',
          options: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'],
          correct: 1,
          explanation: 'По умолчанию PostgreSQL использует уровень изоляции READ COMMITTED, при котором транзакция видит только данные, зафиксированные до начала каждого запроса в транзакции.'
        }
      ],
      mssql: [
        {
          id: 1,
          question: 'Что такое индекс с включёнными столбцами (INCLUDE)?',
          options: [
            'Кластерный индекс',
            'Индекс, содержащий дополнительные столбцы на уровне листьев',
            'Полнотекстовый индекс',
            'Уникальный индекс'
          ],
          correct: 1,
          explanation: 'INCLUDE позволяет добавить в некластерный индекс дополнительные столбцы на уровне листьев B-дерева. Это ускоряет запросы, избегая обращения к самой таблице (covering index).'
        },
        {
          id: 2,
          question: 'Для чего используется @@ROWCOUNT?',
          options: [
            'Подсчёт количества таблиц',
            'Получение числа строк, затронутых последним запросом',
            'Подсчёт количества индексов',
            'Получение размера БД'
          ],
          correct: 1,
          explanation: '@@ROWCOUNT - это системная переменная, которая возвращает количество строк, затронутых последней выполненной инструкцией (INSERT, UPDATE, DELETE, SELECT).'
        },
        {
          id: 3,
          question: 'Что такое план выполнения запроса?',
          options: [
            'Синтаксическая проверка SQL',
            'Визуализация шагов, которые выполняет SQL Server для запроса',
            'История выполненных запросов',
            'Список всех таблиц в БД'
          ],
          correct: 1,
          explanation: 'План выполнения (Execution Plan) показывает, какие операции и в какой последовательности выполняет SQL Server для обработки запроса. Используется для оптимизации производительности.'
        }
      ]
    }
  };

  // Инициализация данных при загрузке
  useEffect(() => {
    const initData = async () => {
      try {
        const data = await QuizDataService.initializeData(defaultData);
        setQuizData(data);
      } catch (error) {
        console.error('Ошибка инициализации:', error);
        setQuizData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  const handleStartQuiz = (categoryId: string) => {
    setPendingCategoryId(categoryId);
    setShowCountModal(true);
  };

  const confirmStartQuiz = (count: number) => {
    if (!quizData || !pendingCategoryId) return;
    const categoryId = pendingCategoryId;
    const original = quizData.questions[categoryId] || [];
    const limitedCount = Math.max(1, Math.min(count, original.length));
    const shuffledQuestions = shuffleArray(original)
      .slice(0, limitedCount)
      .map(q => shuffleQuestionOptions({ ...q }));

    setSelectedCategory(categoryId);
    setSessionQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setScreen('quiz');
    setShowExplanation(false);
    setSelectedAnswer(null);
    setShowResultModal(false);
    setShowCountModal(false);
    setPendingCategoryId(null);
  };

  const cancelStartQuiz = () => {
    setShowCountModal(false);
    setPendingCategoryId(null);
  };

  const handleAnswer = (answerIndex: number) => {
    if (!sessionQuestions) return;

    const currentQuestion = sessionQuestions[currentQuestionIndex];
    const correct = answerIndex === currentQuestion.correct;

    setSelectedAnswer(answerIndex);
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (!sessionQuestions) return;

    if (currentQuestionIndex < sessionQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
    } else {
      setShowResultModal(true);
    }
  };

  const handleGoHome = () => {
    setScreen('home');
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowExplanation(false);
    setSelectedAnswer(null);
    setSessionQuestions(null);
    setShowResultModal(false);
  };

  const handleUpdateData = async () => {
    try {
      const data = await QuizDataService.forceUpdate();
      setQuizData(data);
      alert('Данные успешно обновлены! ✅');
    } catch (error) {
      alert('Не удалось загрузить обновления. Используются локальные данные.');
    }
  };

  if (isLoading || !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center transition-colors">
        <ThemeToggle />
        <div className="text-slate-700 dark:text-slate-200 text-xl">Загрузка...</div>
      </div>
    );
  }

  // Главный экран
  if (screen === 'home') {
    const questionsCount = Object.fromEntries(
      Object.entries(quizData.questions).map(([key, questions]) => [key, questions.length])
    );

    const maxCount = pendingCategoryId ? quizData.questions[pendingCategoryId].length : 0;

    return (
      <>
        <HomeScreen
          categories={quizData.categories}
          questionsCount={questionsCount}
          onStartQuiz={handleStartQuiz}
          onUpdateData={handleUpdateData}
        />
        {showCountModal && pendingCategoryId && (
          <QuestionCountModal
            maxCount={maxCount}
            onCancel={cancelStartQuiz}
            onConfirm={confirmStartQuiz}
          />
        )}
      </>
    );
  }

  // Экран викторины
  if (screen === 'quiz' && selectedCategory) {
    const questions = sessionQuestions ?? [];
    const currentQuestion = questions[currentQuestionIndex];
    const category = quizData.categories.find(c => c.id === selectedCategory);

    if (!category || !currentQuestion) return null;

    return (
      <>
        <QuizScreen
          category={category}
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          score={score}
          showExplanation={showExplanation}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onGoHome={handleGoHome}
        />
        {showResultModal && (
          <ResultModal
            category={category}
            score={score}
            totalQuestions={questions.length}
            onRetry={() => handleStartQuiz(selectedCategory)}
            onGoHome={handleGoHome}
            onClose={() => setShowResultModal(false)}
          />
        )}
      </>
    );
  }

  return null;
}

export default App
