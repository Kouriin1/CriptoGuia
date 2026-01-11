import React, { useState } from 'react';
import { useTheme } from './contexts/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import Header from './components/Header';
import ExchangeRateCard from './components/ExchangeRateCard';
import DailyInsight from './components/DailyInsight';
import AssetDistribution from './components/AssetDistribution';
import GlobalMarket from './components/GlobalMarket';
import AIChat from './components/AIChat';
import Education from './components/Education';
import Simulator from './components/Simulator';
import Security from './components/Security';
import DollarAnalysis from './components/DollarAnalysis';

// Vista de Inicio (home) con los componentes actuales
const HomeView: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6 lg:gap-8">
        {/* Tasa principal - ancho completo */}
        <ExchangeRateCard />

        {/* Insight del día - ancho completo, contenido educativo */}
        <DailyInsight />

        {/* Fila 3: Distribución + Mercado Global juntos (como antes) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <DollarAnalysis />
          </div>
          <div className="lg:col-span-2">
            <GlobalMarket />
          </div>
        </div>

        {/* Chat IA */}
        <AIChat />
      </div>
    </main>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const { isDark } = useTheme();
  const textColor = isDark ? 'text-gray-500' : 'text-gray-600';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-[#f8fafc] text-gray-900'}`}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'inicio' && (
            <PageTransition key="inicio">
              <HomeView />
            </PageTransition>
          )}
          {activeTab === 'educacion' && (
            <PageTransition key="educacion">
              <Education />
            </PageTransition>
          )}
          {activeTab === 'simulador' && (
            <PageTransition key="simulador">
              <Simulator />
            </PageTransition>
          )}
          {activeTab === 'seguridad' && (
            <PageTransition key="seguridad">
              <Security />
            </PageTransition>
          )}
        </AnimatePresence>
      </main>

      <footer className={`text-center p-6 ${textColor} text-sm opacity-60`}>
        CriptoGuíaVE - Tu guía segura al mundo cripto en Venezuela.
      </footer>
    </div>
  );
};

export default App;
