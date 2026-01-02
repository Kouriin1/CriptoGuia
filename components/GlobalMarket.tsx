import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowUpIcon, ArrowDownIcon } from './icons';

const GlobalMarket: React.FC = () => {
  const { isDark } = useTheme();

  const marketData = [
    { name: 'Bitcoin', symbol: 'BTC', price: '$95,432.10', change: '+2.5%', isUp: true },
    { name: 'Ethereum', symbol: 'ETH', price: '$3,456.78', change: '-1.2%', isUp: false },
    { name: 'Solana', symbol: 'SOL', price: '$145.20', change: '+5.8%', isUp: true },
    { name: 'Binance Coin', symbol: 'BNB', price: '$589.45', change: '+0.5%', isUp: true },
    { name: 'Cardano', symbol: 'ADA', price: '$0.45', change: '-0.8%', isUp: false },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 h-full">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-[#f3ba2f] rounded-full"></span>
        Mercado Global
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-3 text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
          <span>Activo</span>
          <span className="text-right">Precio</span>
          <span className="text-right">24h</span>
        </div>
        {marketData.map((coin, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer group border-b border-gray-100 dark:border-gray-800 last:border-0">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {coin.symbol[0]}
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">{coin.name}</p>
                <p className="text-xs text-gray-500">{coin.symbol}</p>
              </div>
            </div>
            <div className="text-right flex-1">
              <p className="font-bold text-sm text-gray-900 dark:text-white">{coin.price}</p>
            </div>
            <div className="text-right flex-1 flex justify-end">
              <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${coin.isUp
                  ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                {coin.isUp ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
                {coin.change}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
        <button className="text-sm font-bold text-[#f3ba2f] hover:text-[#d9a526] transition-colors">
          Ver todos los activos →
        </button>
      </div>
    </div>
  );
};

export default GlobalMarket;
