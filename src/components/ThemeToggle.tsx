import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * Переключатель темы (светлая / темная) с сохранением состояния в localStorage.
 */
export const ThemeToggle: React.FC = () => {
	const STORAGE_KEY = 'theme';
	const [theme, setTheme] = useState<'light' | 'dark'>(() => {
		const saved = localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null;
		if (saved === 'light' || saved === 'dark') return saved;
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		return prefersDark ? 'dark' : 'light';
	});

	useEffect(() => {
		const root = document.documentElement;
		root.classList.remove('light', 'dark');
		root.classList.add(theme);
		localStorage.setItem(STORAGE_KEY, theme);
	}, [theme]);

	const toggle = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
			className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow hover:shadow-md transition-colors"
		>
			{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
		</button>
	);
};
