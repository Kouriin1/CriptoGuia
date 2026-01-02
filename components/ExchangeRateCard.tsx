import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowUpIcon, ArrowDownIcon } from './icons';

const ExchangeRateCard: React.FC = () => {
  const [rate, setRate] = useState<number>(55.45);
  const [prevRate, setPrevRate] = useState<number>(55.45);

  useEffect(() => {
    // Simulación de actualización de precios en tiempo real
    const interval = setInterval(() => {
      setRate(current => {
        setPrevRate(current);
        const change = (Math.random() - 0.5) * 0.1;
        return Math.max(0, current + change);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const isUp = rate >= prevRate;

  return (
    <div className="relative overflow-hidden group p-6 sm:p-8 rounded-3xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl">
      <div className={`absolute top-0 right-0 p-4 opacity-5 pointer-events-none`}>
        <span className="text-9xl font-black">🇻🇪</span>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-bold uppercase tracking-wider text-sm text-gray-500 dark:text-gray-400">
              Tasa Oficial (BCV)
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">USD/VES</p>
          </div>
          <div className={`
                        flex items-center px-2 py-1 rounded-lg text-xs font-bold transition-colors duration-500
                        ${isUp ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}
                    `}>
            {isUp ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
            0.12%
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className={`text-[#f3ba2f] text-2xl font-bold`}>Bs.S</span>
          <span className="text-5xl sm:text-6xl font-black tracking-tighter transition-colors duration-300 text-gray-900 dark:text-white">
            {rate.toFixed(2).split('.')[0]}
            <span className="text-3xl text-gray-400">.{rate.toFixed(2).split('.')[1]}</span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Actualizado en tiempo real
            </p>
          </div>

        </div>
      </div>
      {/* Decorative gradient line at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#f3ba2f] to-orange-500 opacity-50"></div>
    </div>
  );
};

export default ExchangeRateCard;
