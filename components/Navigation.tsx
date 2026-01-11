import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Home, BookOpen, Calculator, ShieldCheck } from 'lucide-react';

interface NavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
    const { isDark } = useTheme();

    const tabs = [
        { id: 'inicio', label: 'Inicio', Icon: Home },
        { id: 'educacion', label: 'Educación', Icon: BookOpen },
        { id: 'simulador', label: 'Simulador', Icon: Calculator },
        { id: 'seguridad', label: 'Seguridad', Icon: ShieldCheck },
    ];

    return (
        <nav className={`border-b sticky top-0 z-30 backdrop-blur-md ${isDark ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white/80'}`}>
            <div className="container mx-auto px-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`
                                    relative px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap flex items-center gap-2
                                    ${isActive
                                        ? isDark ? 'text-[#f3ba2f]' : 'text-blue-600'
                                        : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                                    }
                                `}
                                style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className={`absolute inset-0 rounded-full ${isDark ? 'bg-gray-800' : 'bg-blue-50'}`}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <tab.Icon size={18} />
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
