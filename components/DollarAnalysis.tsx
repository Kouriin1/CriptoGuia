import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowUpIcon, ArrowDownIcon, RefreshIcon } from './icons';
import { getBinanceRate } from '../services/binanceService';
import { analyzeTrend, TrendAnalysis, TrendType } from '../services/rateHistoryService';

const DollarAnalysis: React.FC = () => {
    const { isDark } = useTheme();
    const [currentRate, setCurrentRate] = useState<number | null>(null);
    const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAndAnalyze = async () => {
        try {
            setLoading(true);
            setError(null);

            // Obtener tasa actual de Binance
            const data = await getBinanceRate();
            setCurrentRate(data.rate);

            // Analizar tendencia
            const trendAnalysis = analyzeTrend(data.rate);
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
        // Actualizar cada 5 minutos
        const interval = setInterval(fetchAndAnalyze, 300000);
        return () => clearInterval(interval);
    }, []);

    // Colores y iconos según tendencia
    const getTrendStyles = (trend: TrendType) => {
        switch (trend) {
            case 'ALCISTA':
                return {
                    bgColor: isDark ? 'bg-green-900/20' : 'bg-green-50',
                    borderColor: 'border-green-500',
                    textColor: 'text-green-600 dark:text-green-400',
                    icon: <ArrowUpIcon className="h-5 w-5" />,
                    label: 'Tendencia Alcista',
                    emoji: '📈'
                };
            case 'BAJISTA':
                return {
                    bgColor: isDark ? 'bg-red-900/20' : 'bg-red-50',
                    borderColor: 'border-red-500',
                    textColor: 'text-red-600 dark:text-red-400',
                    icon: <ArrowDownIcon className="h-5 w-5" />,
                    label: 'Tendencia Bajista',
                    emoji: '📉'
                };
            default:
                return {
                    bgColor: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
                    borderColor: 'border-blue-500',
                    textColor: 'text-blue-600 dark:text-blue-400',
                    icon: <span className="text-lg">➡️</span>,
                    label: 'Mercado Estable',
                    emoji: '➡️'
                };
        }
    };

    if (loading && !currentRate) {
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
                    <button
                        onClick={fetchAndAnalyze}
                        className="flex items-center gap-2 mx-auto px-4 py-2 bg-[#f3ba2f] text-gray-900 rounded-lg font-bold hover:bg-[#d9a526] transition-colors"
                    >
                        <RefreshIcon className="h-4 w-4" />
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    const trendStyles = analysis ? getTrendStyles(analysis.trend) : getTrendStyles('ESTABLE');
    const isUp = analysis ? analysis.todayChange >= 0 : true;

    return (
        <div className={`bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 h-full`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#f3ba2f] rounded-full"></span>
                    Análisis del Dólar
                </h2>
                <button
                    onClick={fetchAndAnalyze}
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

            {/* Cambio de hoy */}
            <div className="mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cambio de Hoy</p>
                <div className="flex items-baseline gap-3">
                    {analysis?.yesterdayRate ? (
                        <>
                            <span className={`text-3xl font-black ${isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {isUp ? '+' : ''}{analysis.todayChange.toFixed(2)} Bs
                            </span>
                            <span className={`text-lg font-bold ${isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                ({isUp ? '+' : ''}{analysis.todayChangePercent.toFixed(2)}%)
                            </span>
                        </>
                    ) : (
                        <span className="text-xl text-gray-500">Sin datos de ayer</span>
                    )}
                </div>
                {analysis?.yesterdayRate && (
                    <p className="text-sm text-gray-500 mt-1">
                        Ayer: {analysis.yesterdayRate.toFixed(2)} Bs → Hoy: {currentRate?.toFixed(2)} Bs
                    </p>
                )}
            </div>

            {/* Badge de tendencia con explicación */}
            <div className={`${trendStyles.bgColor} ${trendStyles.borderColor} border-l-4 rounded-xl p-4 mb-6`}>
                <div className="flex items-center gap-3 mb-2">
                    <span className={`${trendStyles.textColor} flex items-center gap-2 font-bold`}>
                        {trendStyles.icon}
                        {trendStyles.label}
                    </span>
                    {analysis && analysis.consecutiveDays > 0 && (
                        <span className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
                            {analysis.consecutiveDays} días
                        </span>
                    )}
                </div>
                {/* Explicación de qué significa */}
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {analysis?.trend === 'ALCISTA' && (
                        <>📌 <strong>Alcista</strong> = El dólar sube = Tus Bs compran menos cada día</>
                    )}
                    {analysis?.trend === 'BAJISTA' && (
                        <>📌 <strong>Bajista</strong> = El dólar baja = Tus Bs compran un poco más (raro en VE)</>
                    )}
                    {analysis?.trend === 'ESTABLE' && (
                        <>📌 <strong>Estable</strong> = Sin cambios grandes estos días</>
                    )}
                </p>
            </div>

            {/* Consejo */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    💡 Consejo
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {analysis?.advice || 'Analizando datos...'}
                </p>
            </div>

            {/* Indicador en vivo */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Datos de Binance P2P
            </div>
        </div>
    );
};

export default DollarAnalysis;
