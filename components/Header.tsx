import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { LogoIcon } from './icons';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { isDark } = useTheme();

  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'educacion', label: 'Educación', icon: '📚' },
    { id: 'simulador', label: 'Simulador', icon: '🔢' },
    { id: 'seguridad', label: 'Seguridad', icon: '🛡️' },
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo y título a la izquierda */}
          <div className="flex items-center gap-3 flex-shrink-0 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-[#f3ba2f] blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <LogoIcon className="h-8 w-8 sm:h-10 sm:w-10 text-[#f3ba2f] relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Cripto<span className="text-[#f3ba2f]">GuíaVE</span>
              </h1>
              <p className="text-[10px] font-medium tracking-wider uppercase text-gray-500">
                Tu guía segura
              </p>
            </div>
          </div>

          {/* Pestañas en el centro/derecha - Desktop */}
          <nav className="hidden md:flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2
                  ${activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Toggle de tema a la derecha */}
          <div className="flex-shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Nav - Ahora dentro del flujo normal, no absolute */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <div className="overflow-x-auto px-4 py-2 flex gap-2 no-scrollbar scroll-smooth">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border
                ${activeTab === tab.id
                  ? 'bg-[#f3ba2f] border-[#f3ba2f] text-gray-900'
                  : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }
              `}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
