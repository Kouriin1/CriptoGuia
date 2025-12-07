import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Simulator: React.FC = () => {
    const { isDark } = useTheme();
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState<'ves-to-crypto' | 'crypto-to-ves'>('ves-to-crypto');

    // Tasas estáticas (valores referenciales)
    const rates = {
        usdtVes: 40.85, // Bs.S por USDT
        btcUsd: 95000,  // USD por BTC
        ethUsd: 3500,   // USD por ETH
    };

    const calculateConversions = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return null;

        if (mode === 'ves-to-crypto') {
            const usd = numAmount / rates.usdtVes;
            return {
                usdt: numAmount / rates.usdtVes,
                btc: usd / rates.btcUsd,
                eth: usd / rates.ethUsd,
            };
        } else {
            // Asumimos que el input es en USD
            return {
                ves: numAmount * rates.usdtVes,
                btc: numAmount / rates.btcUsd,
                eth: numAmount / rates.ethUsd,
            };
        }
    };

    const results = calculateConversions();

    const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
    const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';
    const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
    const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-100';

    return (
        <div className={`${bgColor} ${textColor} min-h-screen p-4 sm:p-6 lg:p-8`}>
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold mb-2 text-center">🔢 Simulador de Conversión</h1>
                <p className={`${textSecondary} text-center mb-8`}>
                    Calcula cuánto recibirás en diferentes criptomonedas
                </p>

                <div className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg mb-8`}>
                    {/* Selector de modo */}
                    <div className="flex gap-4 mb-6 justify-center">
                        <button
                            onClick={() => setMode('ves-to-crypto')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${mode === 'ves-to-crypto'
                                    ? 'bg-[#f3ba2f] text-gray-900'
                                    : inputBg + ' ' + textSecondary
                                }`}
                        >
                            Bs.S → Cripto
                        </button>
                        <button
                            onClick={() => setMode('crypto-to-ves')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${mode === 'crypto-to-ves'
                                    ? 'bg-[#f3ba2f] text-gray-900'
                                    : inputBg + ' ' + textSecondary
                                }`}
                        >
                            USDT → Bs.S
                        </button>
                    </div>

                    {/* Input */}
                    <div className="mb-6">
                        <label className={`block mb-2 font-medium ${textSecondary}`}>
                            {mode === 'ves-to-crypto' ? 'Monto en Bolívares (Bs.S)' : 'Monto en USDT'}
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={mode === 'ves-to-crypto' ? '1000' : '100'}
                            className={`w-full p-4 rounded-lg ${inputBg} ${textColor} text-2xl font-bold border ${borderColor} focus:ring-2 focus:ring-[#f3ba2f] outline-none`}
                        />
                    </div>

                    {/* Tasas de referencia */}
                    <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} p-4 rounded-lg mb-6`}>
                        <p className={`${textSecondary} text-sm mb-2`}>📊 Tasas de referencia (valores estáticos):</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                            <div>
                                <span className={textSecondary}>USDT/VES:</span>
                                <span className="ml-2 font-bold">Bs.S {rates.usdtVes.toFixed(2)}</span>
                            </div>
                            <div>
                                <span className={textSecondary}>BTC/USD:</span>
                                <span className="ml-2 font-bold">${rates.btcUsd.toLocaleString()}</span>
                            </div>
                            <div>
                                <span className={textSecondary}>ETH/USD:</span>
                                <span className="ml-2 font-bold">${rates.ethUsd.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resultados */}
                {results && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4">Resultados de la Conversión</h2>

                        {mode === 'ves-to-crypto' ? (
                            <>
                                <div className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className={textSecondary}>Tether (USDT)</p>
                                            <p className="text-3xl font-bold text-green-500">
                                                {results.usdt.toFixed(2)} USDT
                                            </p>
                                        </div>
                                        <div className="text-5xl">💵</div>
                                    </div>
                                </div>

                                <div className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className={textSecondary}>Bitcoin (BTC)</p>
                                            <p className="text-3xl font-bold text-orange-500">
                                                {results.btc.toFixed(8)} BTC
                                            </p>
                                            <p className={`${textSecondary} text-sm mt-1`}>
                                                ≈ ${(results.btc * rates.btcUsd).toFixed(2)} USD
                                            </p>
                                        </div>
                                        <div className="text-5xl">₿</div>
                                    </div>
                                </div>

                                <div className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className={textSecondary}>Ethereum (ETH)</p>
                                            <p className="text-3xl font-bold text-blue-500">
                                                {results.eth.toFixed(6)} ETH
                                            </p>
                                            <p className={`${textSecondary} text-sm mt-1`}>
                                                ≈ ${(results.eth * rates.ethUsd).toFixed(2)} USD
                                            </p>
                                        </div>
                                        <div className="text-5xl">Ξ</div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className={textSecondary}>Bolívares Soberanos</p>
                                            <p className="text-3xl font-bold text-[#f3ba2f]">
                                                Bs.S {results.ves.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </p>
                                        </div>
                                        <div className="text-5xl">🇻🇪</div>
                                    </div>
                                </div>

                                <div className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className={textSecondary}>Bitcoin (BTC)</p>
                                            <p className="text-3xl font-bold text-orange-500">
                                                {results.btc.toFixed(8)} BTC
                                            </p>
                                        </div>
                                        <div className="text-5xl">₿</div>
                                    </div>
                                </div>

                                <div className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className={textSecondary}>Ethereum (ETH)</p>
                                            <p className="text-3xl font-bold text-blue-500">
                                                {results.eth.toFixed(6)} ETH
                                            </p>
                                        </div>
                                        <div className="text-5xl">Ξ</div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {!amount && (
                    <div className={`${cardBg} p-8 rounded-xl border ${borderColor} text-center`}>
                        <p className={textSecondary}>
                            Ingresa un monto arriba para ver las conversiones
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Simulator;
