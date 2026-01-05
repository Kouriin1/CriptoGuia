import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeftRightIcon, RefreshIcon } from './icons';
import { getBinanceRate } from '../services/binanceService';
import { getCryptoPrices, CryptoPrice } from '../services/cryptoService';

const Simulator: React.FC = () => {
    const { isDark } = useTheme();
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState<'ves-to-crypto' | 'crypto-to-ves'>('ves-to-crypto');

    // Tasa real desde Binance P2P
    const [usdtVesRate, setUsdtVesRate] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    // Precios reales de BTC y ETH desde CoinGecko
    const [btcUsd, setBtcUsd] = useState<number>(95000);
    const [ethUsd, setEthUsd] = useState<number>(3500);

    // Cargar tasas
    const fetchRates = async () => {
        try {
            setLoading(true);

            // Cargar tasa de Binance
            const binanceData = await getBinanceRate();
            setUsdtVesRate(binanceData.rate);
            setLastUpdate(new Date(binanceData.timestamp));

            // Cargar precios de CoinGecko
            try {
                const cryptoData = await getCryptoPrices();
                const btc = cryptoData.prices.find(p => p.symbol === 'BTC');
                const eth = cryptoData.prices.find(p => p.symbol === 'ETH');
                if (btc) setBtcUsd(btc.price);
                if (eth) setEthUsd(eth.price);
            } catch (cryptoErr) {
                console.warn('Error fetching crypto prices, using defaults:', cryptoErr);
            }

            setError(null);
        } catch (err) {
            setError('Error al obtener tasa');
            console.error('Error fetching rate:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
        // Actualizar cada 2 minutos
        const interval = setInterval(fetchRates, 120000);
        return () => clearInterval(interval);
    }, []);

    // Limitar input a máximo 15 caracteres
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Máximo 15 caracteres (para evitar overflow visual)
        if (val.length > 15) return;
        if (!val || parseFloat(val) >= 0) {
            setAmount(val);
        }
    };

    const calculateConversions = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0 || !usdtVesRate) return null;

        if (mode === 'ves-to-crypto') {
            const usd = numAmount / usdtVesRate;
            return {
                usdt: numAmount / usdtVesRate,
                btc: usd / btcUsd,
                eth: usd / ethUsd,
            };
        } else {
            return {
                ves: numAmount * usdtVesRate,
                btc: numAmount / btcUsd,
                eth: numAmount / ethUsd,
            };
        }
    };

    const results = calculateConversions();

    // Función para formatear números grandes (con límite visual)
    const formatLargeNumber = (num: number): string => {
        if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
        if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
        return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-black mb-4">🔢 Simulador de Conversión</h1>
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Calcula estimaciones precisas en tiempo real.
                    </p>
                </div>

                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-8 rounded-3xl shadow-xl border mb-12`}>
                    {/* Selector de modo */}
                    <div className="flex justify-center mb-8">
                        <div className={`inline-flex items-center bg-gray-100 dark:bg-gray-900/50 rounded-full p-1.5 border border-gray-200 dark:border-gray-700`}>
                            <button
                                onClick={() => setMode('ves-to-crypto')}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${mode === 'ves-to-crypto'
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                Bs.S → Cripto
                            </button>
                            <div className="px-2 text-gray-300">
                                <ArrowLeftRightIcon className="h-4 w-4" />
                            </div>
                            <button
                                onClick={() => setMode('crypto-to-ves')}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${mode === 'crypto-to-ves'
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                USDT → Bs.S
                            </button>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="mb-10 relative group">
                        <label className="block mb-3 text-sm font-bold text-gray-400 uppercase tracking-wider text-center">
                            {mode === 'ves-to-crypto' ? 'Monto en Bolívares' : 'Monto en USDT'}
                        </label>
                        <div className="relative max-w-lg mx-auto flex items-center justify-center">
                            <input
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                                onKeyDown={(e) => {
                                    if (['-', '+', 'e', 'E'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                onWheel={(e) => e.currentTarget.blur()}
                                placeholder="0.00"
                                min="0"
                                maxLength={15}
                                className="w-full text-center bg-transparent text-4xl sm:text-5xl font-black placeholder-gray-200 dark:placeholder-gray-700 outline-none transition-colors border-b-2 border-transparent focus:border-[#f3ba2f] pb-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                autoFocus
                            />
                            <span className="absolute top-1/2 -translate-y-1/2 right-0 text-lg font-bold text-gray-400 pointer-events-none">
                                {mode === 'ves-to-crypto' ? 'VES' : 'USDT'}
                            </span>
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-2">
                            Máximo 15 dígitos
                        </p>
                    </div>

                    {/* Tasas de referencia */}
                    <div className="flex flex-wrap justify-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${error
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                            : 'bg-gray-50 dark:bg-gray-700/30 border-gray-100 dark:border-gray-700'
                            }`}>
                            {loading ? (
                                <span className="text-gray-400">Cargando...</span>
                            ) : error ? (
                                <>
                                    <span className="text-red-500">Error</span>
                                    <button onClick={fetchRates} className="text-red-500 hover:text-red-600">
                                        <RefreshIcon className="h-3 w-3" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    USDT/VES: <span className="font-bold text-gray-900 dark:text-gray-200">{usdtVesRate?.toFixed(2)}</span>
                                </>
                            )}
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/30 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                            BTC: <span className="font-bold text-gray-900 dark:text-gray-200">${btcUsd.toLocaleString()}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/30 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                            ETH: <span className="font-bold text-gray-900 dark:text-gray-200">${ethUsd.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Última actualización */}
                    {lastUpdate && !loading && !error && (
                        <div className="text-center mt-4">
                            <p className="text-[10px] text-gray-400">
                                Actualizado: {lastUpdate.toLocaleTimeString()} • Binance P2P + CoinGecko
                            </p>
                        </div>
                    )}
                </div>

                {/* Resultados */}
                {loading && !usdtVesRate ? (
                    <div className="text-center p-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#f3ba2f]"></div>
                        <p className="mt-4 text-gray-500">Cargando tasas en tiempo real...</p>
                    </div>
                ) : results ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                        {mode === 'ves-to-crypto' ? (
                            <>
                                <ResultCard label="Tether" symbol="USDT" amount={results.usdt.toFixed(2)} icon="💵" color="text-green-500" subtext="Stablecoin" />
                                <ResultCard label="Bitcoin" symbol="BTC" amount={results.btc.toFixed(8)} icon="₿" color="text-orange-500" subtext={`≈ $${(results.btc * btcUsd).toFixed(2)}`} />
                                <ResultCard label="Ethereum" symbol="ETH" amount={results.eth.toFixed(6)} icon="Ξ" color="text-blue-500" subtext={`≈ $${(results.eth * ethUsd).toFixed(2)}`} />
                            </>
                        ) : (
                            <>
                                <ResultCard label="Bolívares" symbol="VES" amount={formatLargeNumber(results.ves)} icon="🇻🇪" color="text-[#f3ba2f]" subtext="Moneda Local" />
                                <ResultCard label="Bitcoin" symbol="BTC" amount={results.btc.toFixed(8)} icon="₿" color="text-orange-500" subtext="Equivalente" />
                                <ResultCard label="Ethereum" symbol="ETH" amount={results.eth.toFixed(6)} icon="Ξ" color="text-blue-500" subtext="Equivalente" />
                            </>
                        )}
                    </div>
                ) : (
                    <div className="text-center p-12 opacity-50">
                        <p className="text-lg">Ingresa un monto para ver la magia ✨</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper component for results
const ResultCard = ({ label, symbol, amount, icon, color, subtext }: any) => {
    const { isDark } = useTheme();
    return (
        <div className={`
            relative overflow-hidden p-6 rounded-3xl transition-all hover:-translate-y-1 hover:shadow-xl
            ${isDark ? 'bg-gray-800 border-gray-700 shadow-lg' : 'bg-white border-gray-100 shadow-lg border'}
        `}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-xs text-gray-500 mt-1">{symbol}</p>
                </div>
                <div className="text-4xl opacity-20">{icon}</div>
            </div>

            <p className={`text-2xl sm:text-3xl font-black ${color} tracking-tight break-all`}>
                {amount}
            </p>
            <p className="text-xs font-medium text-gray-400 mt-2">{subtext}</p>
        </div>
    );
};

export default Simulator;
