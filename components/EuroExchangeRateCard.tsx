import React, { useState, useEffect, useCallback } from 'react';
import { RefreshIcon } from './icons'; 

interface EuroProps {
  onSwitch: () => void;
}

interface BCVData {
  success: boolean;
  valor: string;
  timestamp: string;
}

const EuroExchangeRateCard: React.FC<EuroProps> = ({ onSwitch }) => {
  const [rate, setRate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const fetchRate = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/.netlify/functions/euro-rate');
      if (!response.ok) throw new Error('Error al conectar con la función');
      const data: BCVData = await response.json();
      if (data.success) {
        setRate(data.valor);
        setLastUpdate(new Date(data.timestamp).toLocaleTimeString());
        setError(null);
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRate();
    const interval = setInterval(fetchRate, 600000);
    return () => clearInterval(interval);
  }, [fetchRate]);

  const display = rate 
    ? { main: rate.split('.')[0], decimal: rate.split('.')[1] || '00' } 
    : { main: '0', decimal: '00' };

  return (
    <div className="relative overflow-hidden group p-6 sm:p-8 rounded-3xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <span className="text-9xl font-black">🇪🇺</span>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold uppercase tracking-wider text-sm text-gray-500 dark:text-gray-400">
                Tasa Euro
              </h2>
              <button 
                onClick={onSwitch}
                className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:rotate-180 transition-transform duration-500 shadow-sm"
                title="Cambiar a Dólar"
              >
                <RefreshIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">EUR/VES • BCV</p>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-[#003399] dark:text-[#3399ff] text-2xl font-bold">Bs.S</span>
          {loading && !rate ? (
            <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ) : error && !rate ? (
            <span className="text-2xl text-red-500 font-bold">Error</span>
          ) : (
            <span className="text-5xl sm:text-6xl font-black tracking-tighter transition-colors duration-300 text-gray-900 dark:text-white">
              {display.main}
              <span className="text-3xl text-gray-400">.{display.decimal}</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${error ? 'bg-red-400' : 'bg-blue-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${error ? 'bg-red-500' : 'bg-blue-500'}`}></span>
            </span>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {loading && !rate ? 'Cargando...' : error ? 'Error de conexión' : `Actualizado ${lastUpdate}`}
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#003399] to-blue-400 opacity-50"></div>
    </div>
  );
};

export default EuroExchangeRateCard;