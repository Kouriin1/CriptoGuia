import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Colección de insights variados - NO solo educativos
 * Incluye: datos curiosos, estadísticas, contexto venezolano, tips prácticos
 */
const insights = [
    {
        title: "Venezuela es Top 10 en adopción cripto mundial",
        content: "Según Chainalysis, Venezuela está entre los 10 países con mayor adopción de criptomonedas en el mundo. La necesidad económica impulsó a millones a aprender sobre cripto.",
        emoji: "🏆",
        category: "Dato Curioso"
    },
    {
        title: "El bolívar ha perdido 99.99% de su valor",
        content: "Desde el 2013, el bolívar venezolano ha perdido prácticamente todo su valor frente al dólar. Por eso, guardar ahorros en Bs es como verlos desaparecer lentamente.",
        emoji: "📉",
        category: "Realidad VE"
    },
    {
        title: "Más de 10 millones de venezolanos usan cripto",
        content: "Se estima que al menos 1 de cada 3 venezolanos ha usado criptomonedas alguna vez, ya sea para ahorrar, recibir remesas o hacer pagos internacionales.",
        emoji: "👥",
        category: "Estadística"
    },
    {
        title: "Binance tiene más usuarios en VE que muchos bancos",
        content: "Binance se convirtió en una especie de 'banco digital' para venezolanos, permitiendo ahorrar en dólares digitales sin necesidad de cuenta en el exterior.",
        emoji: "🏦",
        category: "Dato Curioso"
    },
    {
        title: "Cultura financiera avanzada",
        content: "Debido a la dinámica económica, el venezolano promedio tiene un conocimiento sobre wallets, exchange y tasas de cambio muy superior al del ciudadano promedio europeo o norteamericano.",
        emoji: "🧠",
        category: "Dato Curioso"
    },
    {
        title: "Las remesas cripto llegan en minutos, no días",
        content: "Antes, enviar dinero de EEUU a Venezuela tomaba días y costaba $20-50. Ahora, tu familiar te envía USDT y en minutos lo tienes en tu billetera.",
        emoji: "⚡",
        category: "Ventaja"
    },
    {
        title: "Zinli y Reserve: Alternativas locales",
        content: "Apps como Zinli y Reserve Dollar nacieron para resolver el problema venezolano: tener dólares digitales sin cuenta bancaria en el exterior.",
        emoji: "📱",
        category: "Alternativas"
    },
    {
        title: "El 'dólar paralelo' refleja la economía real",
        content: "La tasa del BCV es oficial pero nadie la usa realmente. El precio que ves en Binance P2P es el que usan los comercios, las remesas y el día a día.",
        emoji: "💵",
        category: "Realidad VE"
    },
    {
        title: "Venezuela fue pionera en Petro (aunque fracasó)",
        content: "En 2018, Venezuela lanzó el Petro, una 'criptomoneda estatal'. El proyecto fracasó, pero demostró que el gobierno conoce el poder de las criptos.",
        emoji: "🛢️",
        category: "Historia"
    },
    {
        title: "USDT: El efectivo digital",
        content: "El USDT (Tether) se ha convertido en una herramienta cotidiana. Para muchos, funciona como una forma de 'dolarización digital' que permite transar sin necesidad de billetes físicos.",
        emoji: "💵",
        category: "Uso Diario"
    },
    {
        title: "Más allá de USDT: Descubre USDC",
        content: "USDC (Circle) es una stablecoin que te ofrece mayor variedad y seguridad al momento de proteger tus bolívares o realizar compras cripto.",
        emoji: "🛡️",
        category: "Uso Diario"
    }
];

const DailyInsight: React.FC = () => {
    const { isDark } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Al cargar, seleccionar uno aleatorio
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * insights.length);
        setCurrentIndex(randomIndex);
    }, []);

    const insight = insights[currentIndex];

    const navigateTo = (newIndex: number, direction: 'left' | 'right') => {
        if (isAnimating) return;

        setIsAnimating(true);
        setSlideDirection(direction);

        setTimeout(() => {
            setCurrentIndex(newIndex);
            setSlideDirection(null);
            setIsAnimating(false);
        }, 300);
    };

    const goToNext = () => {
        const nextIndex = (currentIndex + 1) % insights.length;
        navigateTo(nextIndex, 'left');
    };

    const goToPrev = () => {
        const prevIndex = (currentIndex - 1 + insights.length) % insights.length;
        navigateTo(prevIndex, 'right');
    };

    const goToIndex = (index: number) => {
        if (index === currentIndex || isAnimating) return;
        const direction = index > currentIndex ? 'left' : 'right';
        navigateTo(index, direction);
    };

    // Clases de animación
    const getSlideClasses = () => {
        if (slideDirection === 'left') {
            return 'animate-slide-out-left';
        }
        if (slideDirection === 'right') {
            return 'animate-slide-out-right';
        }
        return 'animate-slide-in';
    };

    return (
        <div className={`
      relative overflow-hidden
      bg-gradient-to-br ${isDark
                ? 'from-gray-800 via-gray-800 to-gray-900'
                : 'from-white via-gray-50 to-gray-100'
            }
      p-6 sm:p-8 rounded-3xl shadow-xl border 
      ${isDark ? 'border-gray-700' : 'border-gray-200'}
    `}>
            {/* CSS animations */}
            <style>{`
        @keyframes slideOutLeft {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-30px); opacity: 0; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(30px); opacity: 0; }
        }
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-out-left {
          animation: slideOutLeft 0.3s ease-out forwards;
        }
        .animate-slide-out-right {
          animation: slideOutRight 0.3s ease-out forwards;
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>

            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
                <span className="text-[120px]">{insight.emoji}</span>
            </div>

            {/* Header con categoría y navegación */}
            <div className="flex items-center justify-between mb-4">
                <span className={`
          text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full
          ${isDark ? 'bg-[#f3ba2f]/20 text-[#f3ba2f]' : 'bg-[#f3ba2f]/10 text-[#b8860b]'}
        `}>
                    {insight.category}
                </span>

                {/* Botones de navegación */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={goToPrev}
                        disabled={isAnimating}
                        className={`
              w-8 h-8 flex items-center justify-center rounded-full transition-all text-lg
              ${isDark
                                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                            }
              ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                        aria-label="Anterior"
                    >
                        ‹
                    </button>
                    <span className={`text-xs px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {currentIndex + 1}/{insights.length}
                    </span>
                    <button
                        onClick={goToNext}
                        disabled={isAnimating}
                        className={`
              w-8 h-8 flex items-center justify-center rounded-full transition-all text-lg
              ${isDark
                                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                            }
              ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                        aria-label="Siguiente"
                    >
                        ›
                    </button>
                </div>
            </div>

            {/* Contenido principal con animación de slide */}
            <div
                ref={containerRef}
                className={getSlideClasses()}
            >
                {/* Emoji grande + Título */}
                <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl sm:text-5xl flex-shrink-0">{insight.emoji}</span>
                    <h2 className={`text-xl sm:text-2xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {insight.title}
                    </h2>
                </div>

                {/* Párrafo */}
                <p className={`
          text-base sm:text-lg leading-relaxed
          ${isDark ? 'text-gray-300' : 'text-gray-600'}
        `}>
                    {insight.content}
                </p>
            </div>

            {/* Indicador de posición (dots clickeables) */}
            <div className="flex justify-center gap-1.5 mt-6">
                {insights.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToIndex(index)}
                        disabled={isAnimating}
                        className={`
              h-2 rounded-full transition-all duration-300
              ${currentIndex === index
                                ? 'bg-[#f3ba2f] w-6'
                                : isDark
                                    ? 'bg-gray-700 w-2 hover:bg-gray-600'
                                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                            }
              ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
                        aria-label={`Ir al tip ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default DailyInsight;
