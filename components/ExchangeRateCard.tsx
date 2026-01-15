import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowUpIcon, ArrowDownIcon, RefreshIcon } from './icons';
import { getBinanceRate } from '../services/binanceService';
import { getHistory, saveRate, RateEntry } from '../services/rateHistoryService';

// 1. Definimos la interfaz para la prop de cambio
interface ExchangeRateProps {
  onSwitch: () => void;
}

const ExchangeRateCard: React.FC<ExchangeRateProps> = ({ onSwitch }) => {
  const { isDark } = useTheme();
  const [rate, setRate] = useState<number | null>(null);
  const [yesterdayRate, setYesterdayRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const fetchRate = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBinanceRate();
      setRate(data.rate);
      setLastUpdate(new Date(data.timestamp));
      setError(null);

      // Guardar en historial
      saveRate(data.rate);

      // Obtener tasa de ayer del historial
      const history = getHistory();
      if (history.entries.length > 1) {
        // entries[0] es hoy (recién guardado), entries[1] es ayer
        setYesterdayRate(history.entries[1].rate);
      }
    } catch (err) {
      console.error('Error fetching rate:', err);
      setError('Error al obtener tasa');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Al cargar, primero revisar si hay historial
    const history = getHistory();
    if (history.entries.length > 0) {
      // Mostrar último rate conocido mientras carga
      setRate(history.entries[0].rate);
      if (history.entries.length > 1) {
        setYesterdayRate(history.entries[1].rate);
      }
    }

    fetchRate();
    const interval = setInterval(fetchRate, 120000);
    return () => clearInterval(interval);
  }, []);

  // Calcular si subió o bajó comparando con ayer
  const isUp = rate !== null && yesterdayRate !== null ? rate >= yesterdayRate : true;
  const displayRate = rate ?? 0;

  // Calcular el cambio porcentual vs ayer
  const percentChange = rate !== null && yesterdayRate !== null && yesterdayRate !== 0
    ? ((rate - yesterdayRate) / yesterdayRate) * 100
    : null;

  return (
    <div className="relative overflow-hidden group p-6 sm:p-8 rounded-3xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl">
      <div className={`absolute top-0 right-0 p-4 opacity-5 pointer-events-none`}>
        <span className="text-9xl font-black">🇻🇪</span>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-bold uppercase tracking-wider text-sm text-gray-500 dark:text-gray-400">
                Dólar Paralelo
              </h2>
              {/* BOTÓN PARA CAMBIAR A EURO */}
              <button 
                onClick={onSwitch}
                className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:rotate-180 transition-transform duration-500 shadow-sm"
                title="Cambiar a Euro"
              >
                <RefreshIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">USDT/VES • Binance P2P</p>
          </div>
          <div className="flex items-center gap-2">
            {error && (
              <button
                onClick={fetchRate}
                className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                title="Reintentar"
              >
                <RefreshIcon className="h-4 w-4" />
              </button>
            )}
            {percentChange !== null ? (
              <div className={`
                flex items-center px-2 py-1 rounded-lg text-xs font-bold transition-colors duration-500
                ${isUp ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}
              `}>
                {isUp ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
                {Math.abs(percentChange).toFixed(2)}%
              </div>
            ) : (
              <div className="flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                <span className="text-xs">Sin datos previos</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className={`text-[#f3ba2f] text-2xl font-bold`}>Bs.S</span>
          {loading && rate === null ? (
            <div className="flex items-center gap-2">
              <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          ) : error && rate === null ? (
            <span className="text-2xl text-red-500">Error</span>
          ) : (
            <span className="text-5xl sm:text-6xl font-black tracking-tighter transition-colors duration-300 text-gray-900 dark:text-white">
              {displayRate.toFixed(2).split('.')[0]}
              <span className="text-3xl text-gray-400">.{displayRate.toFixed(2).split('.')[1]}</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${error ? 'bg-red-400' : 'bg-green-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${error ? 'bg-red-500' : 'bg-green-500'}`}></span>
            </span>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {loading && rate === null ? 'Cargando...' : error ? 'Error de conexión' : `Actualizado ${lastUpdate ? lastUpdate.toLocaleTimeString() : ''}`}
            </p>
          </div>
          {yesterdayRate !== null && (
            <p className="text-xs text-gray-400">
              Ayer: {yesterdayRate.toFixed(2)} Bs
            </p>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#f3ba2f] to-orange-500 opacity-50"></div>
    </div>
  );
};

export default ExchangeRateCard;
