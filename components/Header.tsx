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
    <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo y título a la izquierda */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <LogoIcon className="h-10 w-10 text-[#f3ba2f]" />
            <div>
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Cripto<span className="text-[#f3ba2f]">GuíaVE</span>
              </h1>
              <p className={`text-xs hidden sm:block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Tu guía segura al mundo cripto
              </p>
            </div>
          </div>

          {/* Pestañas en el centro/derecha */}
          <nav className="flex gap-1 overflow-x-auto flex-1 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  px-3 py-2 font-medium transition-all whitespace-nowrap rounded-lg text-sm
                  ${activeTab === tab.id
                    ? 'bg-[#f3ba2f] text-gray-900'
                    : isDark
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <span className="mr-1.5">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Toggle de tema a la derecha */}
          <div className="flex-shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
