import React from 'react';
import Header from './components/Header';
import ExchangeRateCard from './components/ExchangeRateCard';
import MarketPerspectives from './components/MarketPerspectives';
import AssetDistribution from './components/AssetDistribution';
import GlobalMarket from './components/GlobalMarket';
import AIChat from './components/AIChat';

const App: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />
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
      <footer className="text-center p-6 text-gray-500 text-sm">
        CriptoGuíaVE - Tu guía segura al mundo cripto en Venezuela.
      </footer>
    </div>
  );
};

export default App;
