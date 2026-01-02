import React, { useState } from 'react';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import ExchangeRateCard from './components/ExchangeRateCard';
import MarketPerspectives from './components/MarketPerspectives';
import AssetDistribution from './components/AssetDistribution';
import GlobalMarket from './components/GlobalMarket';
import AIChat from './components/AIChat';
import Education from './components/Education';
import Simulator from './components/Simulator';
import Security from './components/Security';

// Vista de Inicio (home) con los componentes actuales
const HomeView: React.FC = () => {
  const { isDark } = useTheme();
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6 lg:gap-8">
        <ExchangeRateCard />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <MarketPerspectives />
          </div>
          <div className="flex flex-col gap-6 lg:gap-8">
            <AssetDistribution />
            <GlobalMarket />
          </div>
        </div>

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

      {activeTab === 'inicio' && <HomeView />}
      {activeTab === 'educacion' && <Education />}
      {activeTab === 'simulador' && <Simulator />}
      {activeTab === 'seguridad' && <Security />}

      <footer className={`text-center p-6 ${textColor} text-sm`}>
        CriptoGuíaVE - Tu guía segura al mundo cripto en Venezuela.
      </footer>
    </div>
  );
};

export default App;
