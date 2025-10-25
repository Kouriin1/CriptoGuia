
import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from './icons';

const ExchangeRateCard: React.FC = () => {
  const [rate, setRate] = useState(40.85);

  useEffect(() => {
    const interval = setInterval(() => {
      setRate(prevRate => {
        const change = (Math.random() - 0.5) * 0.1;
        return parseFloat((prevRate + change).toFixed(2));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-medium text-gray-400">Tasa Referencial P2P (USDT/VES)</h2>
        <div className="flex items-center text-green-400 text-xs font-bold">
            <ArrowUpIcon className="h-3 w-3 mr-1" />
            <span>+0.12%</span>
        </div>
      </div>
      <p className="text-5xl font-extrabold mt-2">
        Bs.S <span className="text-[#f3ba2f]">{rate.toFixed(2).replace('.', ',')}</span>
      </p>
    </div>
  );
};

export default ExchangeRateCard;
