import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface NavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
    const { isDark } = useTheme();

    const tabs = [
        { id: 'inicio', label: 'Inicio', icon: '🏠' },
        { id: 'educacion', label: 'Educación', icon: '📚' },
        { id: 'simulador', label: 'Simulador', icon: '🔢' },
        { id: 'seguridad', label: 'Seguridad', icon: '🛡️' },
    ];

    return (
        <nav className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
            <div className="container mx-auto px-4">
                <div className="flex gap-1 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                    px-4 py-3 font-medium transition-all whitespace-nowrap
                                    ${activeTab === tab.id
                                    ? isDark
                                        ? 'border-b-2 border-[#f3ba2f] text-[#f3ba2f]'
                                        : 'border-b-2 border-[#f3ba2f] text-[#f3ba2f]'
                                    : isDark
                                        ? 'text-gray-400 hover:text-gray-200'
                                        : 'text-gray-600 hover:text-gray-900'
                                }
              `}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
