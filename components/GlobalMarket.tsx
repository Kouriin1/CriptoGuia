import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowUpIcon, ArrowDownIcon, RefreshIcon } from './icons';
import { getCryptoPrices, formatPrice, formatChange, CryptoPrice } from '../services/cryptoService';

const GlobalMarket: React.FC = () => {
  const { isDark } = useTheme();
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCryptoPrices();
      setPrices(data.prices);
      setLastUpdate(new Date(data.timestamp));
    } catch (err) {
      console.error('Error fetching prices:', err);
      setError('Error al cargar precios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    // Actualizar cada 3 minutos (180000ms)
    const interval = setInterval(fetchPrices, 180000);
    return () => clearInterval(interval);
  }, []);

  // Emojis/iconos para cada cripto
  const getCryptoIcon = (symbol: string) => {
    const icons: { [key: string]: string } = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'USDT': '₮',
      'SOL': '◎',
      'BNB': '🔶',
    };
    return icons[symbol] || symbol[0];
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-[#f3ba2f] rounded-full"></span>
          Mercado Global
        </h2>
        <button
          onClick={fetchPrices}
          disabled={loading}
          className={`p-2 rounded-lg transition-colors ${loading
              ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          title="Actualizar"
        >
          <RefreshIcon className={`h-4 w-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Estado de carga inicial */}
      {loading && prices.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#f3ba2f] mb-4"></div>
            <p className="text-gray-500">Cargando precios...</p>
          </div>
        </div>
      )}

      {/* Error sin datos */}
      {error && prices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchPrices}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-[#f3ba2f] text-gray-900 rounded-lg font-bold hover:bg-[#d9a526] transition-colors"
          >
            <RefreshIcon className="h-4 w-4" />
            Reintentar
          </button>
        </div>
      )}

      {/* Lista de precios */}
      {prices.length > 0 && (
        <>
          <div className="space-y-4">
            {/* Header de columnas */}
            <div className="grid grid-cols-3 text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
              <span>Activo</span>
              <span className="text-right">Precio</span>
              <span className="text-right">24h</span>
            </div>

            {/* Filas de criptos */}
            {prices.map((coin) => (
              <div
                key={coin.id}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer group border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    {getCryptoIcon(coin.symbol)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{coin.name}</p>
                    <p className="text-xs text-gray-500">{coin.symbol}</p>
                  </div>
                </div>
                <div className="text-right flex-1">
                  <p className="font-bold text-sm text-gray-900 dark:text-white">
                    {formatPrice(coin.price)}
                  </p>
                </div>
                <div className="text-right flex-1 flex justify-end">
                  <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${coin.change24h >= 0
                      ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                      : 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    {coin.change24h >= 0
                      ? <ArrowUpIcon className="h-3 w-3 mr-1" />
                      : <ArrowDownIcon className="h-3 w-3 mr-1" />
                    }
                    {formatChange(coin.change24h)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer con última actualización */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            CoinGecko • Actualizado {lastUpdate?.toLocaleTimeString()}
          </div>
        </>
      )}
    </div>
  );
};

export default GlobalMarket;
