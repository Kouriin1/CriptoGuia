import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { LogoIcon } from './icons';
import { motion } from 'framer-motion';
import { Home, BookOpen, Calculator, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { isDark } = useTheme();

  const tabs = [
    { id: 'inicio', label: 'Inicio', Icon: Home },
    { id: 'educacion', label: 'Educación', Icon: BookOpen },
    { id: 'simulador', label: 'Simulador', Icon: Calculator },
    { id: 'seguridad', label: 'Seguridad', Icon: ShieldCheck },
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
          <nav className="hidden md:flex bg-gray-100/50 dark:bg-gray-800/50 p-1.5 rounded-full border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                      relative px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 z-10
                      ${isActive
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }
                    `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill-header"
                      className="absolute inset-0 bg-white dark:bg-gray-700 shadow-sm rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <tab.Icon size={18} className="relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Toggle de tema a la derecha */}
          <div className="flex-shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Nav - Improved for full visibility */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <div className="relative">
          {/* Scroll container with proper padding */}
          <div className="overflow-x-auto px-4 py-3 flex gap-3 no-scrollbar scroll-smooth" style={{ paddingRight: '2rem' }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-sm
                    ${isActive
                      ? 'bg-gradient-to-r from-[#f3ba2f] to-[#e5a91f] text-gray-900 shadow-md'
                      : isDark
                        ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }
                  `}
                >
                  <tab.Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          {/* Fade edge indicator for scroll */}
          <div className={`absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l ${isDark ? 'from-gray-900' : 'from-white'} to-transparent`}></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
