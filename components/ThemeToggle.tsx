import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from './icons';

const ThemeToggle: React.FC = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${isDark
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
            aria-label="Toggle theme"
        >
            {isDark ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
            ) : (
                <MoonIcon className="h-5 w-5 text-gray-700" />
            )}
        </button>
    );
};

export default ThemeToggle;
