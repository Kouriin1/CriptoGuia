import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowUpIcon, ArrowDownIcon, RefreshIcon } from './icons';
import { getBinanceRate } from '../services/binanceService';
import { analyzeTrend, TrendAnalysis, TrendType } from '../services/rateHistoryService';
import { Building2, TrendingUp, AlertTriangle, CheckCircle2, History, Scale } from 'lucide-react';

type ViewMode = 'TREND' | 'GAP';

const DollarAnalysis: React.FC = () => {
    const { isDark } = useTheme();
    const [viewMode, setViewMode] = useState<ViewMode>('TREND');
    const [parallelRate, setParallelRate] = useState<number | null>(null);
    const [bcvRate, setBcvRate] = useState<number | null>(null);
    const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAndAnalyze = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Fetch Parallel Rate (Binance)
            const binanceData = await getBinanceRate();
            setParallelRate(binanceData.rate);

            // 2. Fetch BCV Rate
            try {
                const resUsd = await fetch('/.netlify/functions/dolar-rate');
                const dataUsd = await resUsd.json();
                if (dataUsd.success && dataUsd.valor) {
                    setBcvRate(parseFloat(dataUsd.valor));
                }
            } catch (e) {
                console.warn('Error fetching BCV rate for analysis', e);
            }

            // 3. Analyze Trend (Parallel)
            const trendAnalysis = analyzeTrend(binanceData.rate);
            setAnalysis(trendAnalysis);

        } catch (err) {
            console.error('Error fetching rate:', err);
            setError('Error al obtener datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndAnalyze();
        const interval = setInterval(fetchAndAnalyze, 300000); // 5 min
        return () => clearInterval(interval);
    }, []);

    // --- GAP LOGIC ---
    const gap = (parallelRate && bcvRate)
        ? ((parallelRate - bcvRate) / bcvRate) * 100
        : 0;

    const getGapStatus = (gapVal: number) => {
        if (gapVal < 3) return { status: 'ESTABLE', color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle2, text: 'Brecha Baja' };
        if (gapVal < 8) return { status: 'MODERADO', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: TrendingUp, text: 'Brecha Moderada' };
        return { status: 'ALTA', color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertTriangle, text: 'Brecha Alta' };
    };
    const gapInfo = getGapStatus(gap);

    // --- TREND LOGIC ---
    const getTrendStyles = (trend: TrendType) => {
        switch (trend) {
            case 'ALCISTA':
                return {
                    bgColor: isDark ? 'bg-green-900/20' : 'bg-green-50',
                    borderColor: 'border-green-500',
                    textColor: 'text-green-600 dark:text-green-400',
                    icon: <ArrowUpIcon className="h-5 w-5" />,
                    label: 'Tendencia Alcista'
                };
            case 'BAJISTA':
                return {
                    bgColor: isDark ? 'bg-red-900/20' : 'bg-red-50',
                    borderColor: 'border-red-500',
                    textColor: 'text-red-600 dark:text-red-400',
                    icon: <ArrowDownIcon className="h-5 w-5" />,
                    label: 'Tendencia Bajista'
                };
            default:
                return {
                    bgColor: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
                    borderColor: 'border-blue-500',
                    textColor: 'text-blue-600 dark:text-blue-400',
                    icon: <TrendingUp className="h-5 w-5 rotate-90" />,
                    label: 'Mercado Estable'
                };
        }
    };
    const trendStyles = analysis ? getTrendStyles(analysis.trend) : getTrendStyles('ESTABLE');
    const isUp = analysis ? analysis.todayChange >= 0 : true;

    if (loading && !parallelRate) {
        return (
            <div className={`bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 h-full flex items-center justify-center`}>
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#f3ba2f] mb-4"></div>
                    <p className="text-gray-500">Analizando mercado...</p>
                </div>
            </div>
        );
    }

    if (error && !analysis) {
        return (
            <div className={`bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 h-full`}>
                <div className="text-center py-8">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button onClick={fetchAndAnalyze} className="flex items-center gap-2 mx-auto px-4 py-2 bg-[#f3ba2f] text-gray-900 rounded-lg font-bold hover:bg-[#d9a526] transition-colors">
                        <RefreshIcon className="h-4 w-4" /> Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 h-full flex flex-col`}>

            {/* Header & Toggle */}
            <div className="flex flex-col gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#f3ba2f] rounded-full shrink-0"></span>
                    <span className="whitespace-nowrap">Análisis del Dólar</span>
                </h2>

                <div className="flex bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1 self-start">
                    <button
                        onClick={() => setViewMode('TREND')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'TREND'
                                ? 'bg-white dark:bg-gray-600 text-[#f3ba2f] shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        <History className="w-3 h-3" /> Tendencia
                    </button>
                    <button
                        onClick={() => setViewMode('GAP')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'GAP'
                                ? 'bg-white dark:bg-gray-600 text-[#f3ba2f] shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                            }`}
                    >
                        <Scale className="w-3 h-3" /> Brecha
                    </button>
                </div>
            </div>

            {/* VIEW: TREND (Historical) */}
            {viewMode === 'TREND' && (
                <div className="animate-fade-in">
                    <div className="mb-6">
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cambio (Hoy vs Ayer)</p>
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500">Paralelo</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                            {analysis?.yesterdayRate ? (
                                <>
                                    <span className={`text-4xl font-black ${isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {isUp ? '+' : ''}{analysis.todayChange.toFixed(2)} Bs
                                    </span>
                                    <span className={`text-xl font-bold ${isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        ({isUp ? '+' : ''}{analysis.todayChangePercent.toFixed(2)}%)
                                    </span>
                                </>
                            ) : (
                                <span className="text-xl text-gray-500">Sin datos de ayer</span>
                            )}
                        </div>
                        {analysis?.yesterdayRate && (
                            <p className="text-sm text-gray-500 mt-2 font-medium">
                                Ayer: <span className="text-gray-700 dark:text-gray-300">{analysis.yesterdayRate.toFixed(2)}</span> → Hoy: <span className="text-gray-700 dark:text-gray-300">{parallelRate?.toFixed(2)}</span>
                            </p>
                        )}
                    </div>

                    <div className={`${trendStyles.bgColor} ${trendStyles.borderColor} border-l-4 rounded-xl p-4 mb-6`}>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`${trendStyles.textColor} flex items-center gap-2 font-bold`}>
                                {trendStyles.icon}
                                {trendStyles.label}
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
                            {analysis?.trend === 'ALCISTA' && "El dólar sube = Tus Bs compran menos cada día."}
                            {analysis?.trend === 'BAJISTA' && "El dólar baja = Una corrección temporal en el mercado."}
                            {analysis?.trend === 'ESTABLE' && "Sin cambios bruscos. Aprovecha la estabilidad."}
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            💡 Consejo
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            {analysis?.advice || 'Analizando datos...'}
                        </p>
                    </div>
                </div>
            )}


            {/* VIEW: GAP (Brecha) */}
            {viewMode === 'GAP' && (
                <div className="animate-fade-in flex flex-col h-full">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/30">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Paralelo</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{parallelRate?.toFixed(2)}</p>
                            <div className={`flex items-center gap-1 text-xs font-bold mt-1 ${analysis?.todayChange! >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {Math.abs(analysis?.todayChangePercent || 0).toFixed(2)}%
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Building2 className="w-3 h-3" /> BCV
                            </p>
                            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                {bcvRate ? bcvRate.toFixed(2) : '--'}
                            </p>
                            <p className="text-xs text-blue-400/80 mt-1">Tasa Oficial</p>
                        </div>
                    </div>

                    {bcvRate && parallelRate && (
                        <div className={`mb-6 p-4 rounded-2xl border ${gapInfo.bg} ${gapInfo.color.replace('text-', 'border-').replace('500', '200')} border-opacity-50`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <gapInfo.icon className={`w-5 h-5 ${gapInfo.color}`} />
                                    <span className={`font-bold ${gapInfo.color}`}>{gapInfo.text}</span>
                                </div>
                                <span className={`text-2xl font-black ${gapInfo.color}`}>{gap.toFixed(2)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${gapInfo.color.replace('text-', 'bg-')}`}
                                    style={{ width: `${Math.min(gap * 5, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 flex-grow">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            💡 Observación
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            {gap > 8 ? (
                                "⚠️ La brecha es ALTA. Existe una fuerte distorsión respecto a la tasa oficial. Ten precaución al fijar precios o hacer transacciones, ya que la diferencia puede afectar tus costos."
                            ) : gap > 3 ? (
                                "⚖️ La brecha es MODERADA. El mercado muestra cierta distancia del oficial, mantente atento a los cambios en las próximas horas."
                            ) : (
                                "✅ La brecha es BAJA. El mercado paralelo está alineado con el oficial, lo que indica estabilidad momentánea."
                            )}
                        </p>
                    </div>
                </div>
            )}

            {/* Footer Info */}
            <div className="mt-auto pt-4 flex items-center justify-center gap-2 text-xs text-gray-400 border-t border-gray-100 dark:border-gray-700/50">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Datos en tiempo real (Binance P2P {viewMode === 'GAP' && '& BCV'})
            </div>

        </div>
    );
};

export default DollarAnalysis;
