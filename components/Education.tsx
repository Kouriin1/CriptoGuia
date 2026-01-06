import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpenIcon, LightBulbIcon, MapIcon, VideoCameraIcon, ArrowDownIcon } from './icons';

// Import images
import p2pImg from '../img/2p2.png';
import binanceImg from '../img/logo_binance.png';
import tetherImg from '../img/logo_tether.png';
import TrustWalletImg from '../img/trust-wallet.png';
import BinancePayImg from '../img/comprobante_binance.jpeg';

// ============================================
// TIPOS
// ============================================
interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
}

// ============================================
// COMPONENTE: YouTube Video Embebido
// ============================================
const YouTubeEmbed: React.FC<{ videoUrl: string; title: string }> = ({ videoUrl, title }) => {
    // Extraer video ID de la URL de YouTube
    const getVideoId = (url: string): string | null => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        return match ? match[1] : null;
    };

    const videoId = getVideoId(videoUrl);

    if (!videoId) return null;

    return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
};

// ============================================
// FUNCIÓN: Mezclar array aleatoriamente (Fisher-Yates)
// ============================================
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ============================================
// FUNCIÓN: Preparar preguntas con opciones mezcladas
// ============================================
function prepareRandomQuiz(allQuestions: QuizQuestion[], count: number): QuizQuestion[] {
    // Mezclar todas las preguntas y tomar 'count' de ellas
    const selectedQuestions = shuffleArray(allQuestions).slice(0, count);

    // Para cada pregunta, mezclar las opciones y actualizar el correctIndex
    return selectedQuestions.map(q => {
        const correctAnswer = q.options[q.correctIndex];
        const shuffledOptions = shuffleArray(q.options);
        const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);

        return {
            ...q,
            options: shuffledOptions,
            correctIndex: newCorrectIndex
        };
    });
}

// ============================================
// COMPONENTE: Quiz Interactivo
// ============================================
const Quiz: React.FC<{
    allQuestions: QuizQuestion[];
    questionsPerQuiz: number;
    sectionName: string;
    onComplete: () => void;
    onNewQuiz: () => void;
    isDark: boolean;
}> = ({ allQuestions, questionsPerQuiz, sectionName, onComplete, onNewQuiz, isDark }) => {
    const [randomizedQuestions, setRandomizedQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    // Inicializar quiz con preguntas aleatorias
    useEffect(() => {
        setRandomizedQuestions(prepareRandomQuiz(allQuestions, questionsPerQuiz));
    }, [allQuestions, questionsPerQuiz]);

    const handleAnswer = (index: number) => {
        if (showResult || randomizedQuestions.length === 0) return;
        setSelectedAnswer(index);
        setShowResult(true);

        if (index === randomizedQuestions[currentQuestion].correctIndex) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < randomizedQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setQuizCompleted(true);
            onComplete();
        }
    };

    const restartQuiz = () => {
        // Generar nuevo set de preguntas aleatorias
        setRandomizedQuestions(prepareRandomQuiz(allQuestions, questionsPerQuiz));
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setQuizCompleted(false);
        onNewQuiz();
    };

    if (randomizedQuestions.length === 0) return null;

    if (quizCompleted) {
        const passed = score >= randomizedQuestions.length * 0.7; // 70% para aprobar
        return (
            <div className={`p-6 rounded-2xl text-center ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className={`text-6xl mb-4`}>
                    {passed ? '🎉' : '📚'}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${passed ? 'text-green-500' : 'text-orange-500'}`}>
                    {passed ? '¡Felicidades!' : '¡Sigue aprendiendo!'}
                </h3>
                <p className={`text-lg mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Obtuviste <span className="font-bold">{score}/{randomizedQuestions.length}</span> respuestas correctas
                </p>
                <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {passed
                        ? `¡Completaste el módulo de ${sectionName}!`
                        : 'Revisa el contenido y vuelve a intentarlo'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={restartQuiz}
                        className="px-6 py-3 bg-[#f3ba2f] text-gray-900 rounded-xl font-bold hover:bg-[#d9a526] transition-colors"
                    >
                        🔄 Nuevo Quiz (Preguntas diferentes)
                    </button>
                </div>
                <p className={`mt-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    💡 Cada quiz tiene preguntas aleatorias del banco de preguntas
                </p>
            </div>
        );
    }

    const current = randomizedQuestions[currentQuestion];

    return (
        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            {/* Progreso */}
            <div className="flex items-center justify-between mb-6">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Pregunta {currentQuestion + 1} de {randomizedQuestions.length}
                </span>
                <div className="flex gap-1">
                    {randomizedQuestions.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 w-8 rounded-full transition-colors ${i <= currentQuestion
                                ? 'bg-[#f3ba2f]'
                                : isDark ? 'bg-gray-700' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Pregunta */}
            <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                {current.question}
            </h3>

            {/* Opciones */}
            <div className="space-y-3 mb-6">
                {current.options.map((option, index) => {
                    let bgColor = isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200';
                    let borderColor = isDark ? 'border-gray-600' : 'border-gray-200';

                    if (showResult) {
                        if (index === current.correctIndex) {
                            bgColor = 'bg-green-500/20';
                            borderColor = 'border-green-500';
                        } else if (index === selectedAnswer && index !== current.correctIndex) {
                            bgColor = 'bg-red-500/20';
                            borderColor = 'border-red-500';
                        }
                    } else if (selectedAnswer === index) {
                        bgColor = 'bg-[#f3ba2f]/20';
                        borderColor = 'border-[#f3ba2f]';
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            disabled={showResult}
                            className={`w-full p-4 rounded-xl text-left font-medium border-2 transition-all ${bgColor} ${borderColor} ${isDark ? 'text-gray-100' : 'text-gray-800'}`}
                        >
                            <span className="flex items-center gap-3">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                {option}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Feedback y siguiente */}
            {showResult && (
                <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${selectedAnswer === current.correctIndex ? 'text-green-500' : 'text-red-500'}`}>
                        <span className="text-2xl">{selectedAnswer === current.correctIndex ? '✅' : '❌'}</span>
                        <span className="font-medium">
                            {selectedAnswer === current.correctIndex ? '¡Correcto!' : 'Incorrecto'}
                        </span>
                    </div>
                    <button
                        onClick={nextQuestion}
                        className="px-6 py-3 bg-[#f3ba2f] text-gray-900 rounded-xl font-bold hover:bg-[#d9a526] transition-colors"
                    >
                        {currentQuestion < randomizedQuestions.length - 1 ? 'Siguiente →' : 'Ver Resultados'}
                    </button>
                </div>
            )}
        </div>
    );
};

// ============================================
// COMPONENTE PRINCIPAL: Education
// ============================================
const Education: React.FC = () => {
    const { isDark } = useTheme();
    const [activeSection, setActiveSection] = useState<'glosario' | 'guias' | 'casos'>('glosario');
    const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
    const [showQuiz, setShowQuiz] = useState<string | null>(null);
    const [completedSections, setCompletedSections] = useState<string[]>([]);

    // Cargar progreso del localStorage
    useEffect(() => {
        const saved = localStorage.getItem('education_progress');
        if (saved) {
            setCompletedSections(JSON.parse(saved));
        }
    }, []);

    const toggleTerm = (term: string) => {
        setExpandedTerm(expandedTerm === term ? null : term);
    };

    const handleQuizComplete = (section: string) => {
        if (!completedSections.includes(section)) {
            const updated = [...completedSections, section];
            setCompletedSections(updated);
            localStorage.setItem('education_progress', JSON.stringify(updated));
        }
    };

    // ============================================
    // DATOS: Glosario
    // ============================================
    const glossaryTerms = [
        {
            term: 'Blockchain',
            definition: 'Cadena de bloques, es un registro digital distribuido e inmutable donde se almacenan las transacciones de criptomonedas. Es como un libro contable público que nadie puede borrar.',
            examples: 'Bitcoin (la primera blockchain), Ethereum (contratos inteligentes), Tron (muy usada en Venezuela para USDT).',
            image: null
        },
        {
            term: 'Wallet (Billetera)',
            definition: 'Herramienta digital o física que almacena las claves públicas y privadas necesarias para gestionar criptomonedas. No guarda las monedas en sí, sino el acceso a ellas en la blockchain.',
            examples: 'Hot Wallets (Trust Wallet, MetaMask), Cold Wallets (Ledger, Trezor), Exchange Wallets (Binance).',
            image: TrustWalletImg
        },
        {
            term: 'Stablecoin',
            definition: 'Criptomoneda diseñada para mantener un valor estable, generalmente vinculada 1:1 al dólar estadounidense. Son vitales para protegerse de la inflación.',
            examples: 'USDT (Tether), USDC (USD Coin), DAI.',
            image: tetherImg
        },
        {
            term: 'P2P (Peer-to-Peer)',
            definition: 'Mercado entre pares donde los usuarios intercambian criptomonedas directamente entre sí sin un intermediario centralizado que custodie los fondos durante la oferta.',
            examples: 'Binance P2P (muy popular en Venezuela), El Dorado, Syklo.',
            image: p2pImg
        },
        {
            term: 'Gas Fees',
            definition: 'Comisiones que se pagan a la red por procesar una transacción. El costo depende de la congestión de la red y la complejidad de la operación.',
            examples: 'Red Ethereum (ERC20) suele ser costosa ($5-$50+), Red Tron (TRC20) es económica ($1 aprox), Red BSC (BEP20) es muy barata.',
            image: null
        },
        {
            term: 'KYC (Know Your Customer)',
            definition: 'Proceso de verificación de identidad que exigen las plataformas centralizadas para cumplir con regulaciones legales y prevenir delitos financieros.',
            examples: 'Enviar foto de tu cédula y una selfie al registrarte en Binance o Zinli.',
            image: BinancePayImg
        },
        {
            term: 'Exchange',
            definition: 'Plataforma digital que permite comprar, vender e intercambiar criptomonedas por otras criptomonedas o por dinero fiduciario (Bolívares, Dólares).',
            examples: 'Centralizados (CEX): Binance, Coinbase. Descentralizados (DEX): Uniswap, PancakeSwap.',
            image: binanceImg
        },
        {
            term: 'Clave Privada (Private Key)',
            definition: 'Código secreto alfanumérico que otorga control total sobre los fondos de una dirección de billetera. Quien tenga esta clave, es dueño del dinero.',
            examples: 'Una cadena larga de caracteres que nunca debes mostrar. Es lo que genera tu Seed Phrase.',
            image: null
        },
        {
            term: 'Seed Phrase (Frase Semilla)',
            definition: 'Conjunto de 12 a 24 palabras generadas aleatoriamente que sirven como respaldo para recuperar tu billetera y fondos en cualquier dispositivo.',
            examples: '"witch collapse practice feed shame open despair creek road again ice least" (Nunca compartas esto).',
            image: null
        },
        {
            term: 'Smart Contract',
            definition: 'Contratos autoejecutables con los términos del acuerdo escritos directamente en líneas de código. Se ejecutan automáticamente cuando se cumplen las condiciones.',
            examples: 'Protocolos de préstamos en DeFi, venta de NFTs, automatización de pagos.',
            image: null
        }
    ];

    // ============================================
    // DATOS: Guías con videos
    // ============================================
    const guides = [
        {
            title: '¿Cómo instalar y usar Trust Wallet?',
            steps: [
                'Descarga Trust Wallet desde la tienda oficial de tu dispositivo (App Store o Google Play).',
                'Abre la app y selecciona "Crear una nueva billetera".',
                'Acepta los términos y condiciones.',
                'IMPORTANTE: Copia tu Frase de Recuperación (Seed Phrase) en un papel y guárdalo en un lugar seguro. No hagas captura de pantalla.',
                'Verifica las palabras en el orden correcto para confirmar que las guardaste.',
                '¡Listo! Ahora puedes recibir criptomonedas copiando tu dirección pública.'
            ],
            warning: '⚠️ Nunca compartas tu Seed Phrase. El soporte técnico NUNCA te la pedirá.',
            videoUrl: 'https://www.youtube.com/watch?v=Y-cgqcg5u4A'
        },
        {
            title: '¿Cómo comprar USDT en Binance P2P?',
            steps: [
                'Regístrate en Binance y completa la verificación de identidad (KYC).',
                'Ve a la sección "Trading" > "P2P".',
                'Selecciona "Comprar" y la moneda "USDT". Filtra por moneda "VES" (Bolívares).',
                'Elige un comerciante verificado (con tilde amarilla) y alto porcentaje de finalización.',
                'Ingresa el monto en Bolívares que deseas invertir.',
                'Realiza la transferencia bancaria (Pago Móvil, etc.) a los datos que te muestra la plataforma.',
                'Marca la orden como "Pagado" en Binance. ¡No olvides este paso!',
                'Espera a que el vendedor libere los USDT a tu billetera de fondos.'
            ],
            warning: '⚠️ NUNCA canceles la orden si ya pagaste. NUNCA pagues si la orden se canceló.',
            videoUrl: 'https://www.youtube.com/watch?v=Ea2GqEAI0vg'
        },
        {
            title: '¿Cómo enviar criptomonedas (Retiros)?',
            steps: [
                'Obtén la dirección de depósito del destinatario (asegúrate que sea la red correcta).',
                'En tu billetera o exchange, selecciona la moneda y dale a "Retirar" o "Enviar".',
                'Pega la dirección del destinatario. ¡Verifícala carácter por carácter!',
                'Selecciona la red de transferencia (ej. TRC20 para USDT en Tron). Debe coincidir con la del destino.',
                'Ingresa el monto y confirma la transacción con tus métodos de seguridad (2FA, email, etc.).',
                'Espera la confirmación de la red.'
            ],
            warning: '⚠️ Enviar a una red incorrecta (ej. enviar USDT BEP20 a una dirección TRC20) puede resultar en la pérdida total de los fondos.',
            videoUrl: 'https://www.youtube.com/watch?v=rgK9K1dwCII'
        }
    ];

    // ============================================
    // DATOS: Casos de uso
    // ============================================
    const useCases = [
        {
            title: '💸 Recibir Remesas',
            description: 'Recibe dinero de familiares en el extranjero instantáneamente y con bajas comisiones usando USDT.',
            benefits: ['Disponible 24/7', 'Comisiones mucho menores que Western Union', 'Cambio a Bolívares inmediato por P2P']
        },
        {
            title: '🛡️ Protección contra Inflación',
            description: 'Resguarda el valor de tu trabajo o ahorros convirtiendo Bolívares a Stablecoins (USDT/USDC).',
            benefits: ['Mantiene el poder adquisitivo', 'Liquidez inmediata', 'Sin requisitos de cuenta en el extranjero']
        },
        {
            title: '💳 Pagos Internacionales',
            description: 'Paga servicios como Netflix, Spotify, Amazon o cursos online usando tarjetas virtuales recargables con cripto (ej. Zinli, Wally).',
            benefits: ['Acceso a economía global', 'Sin necesidad de tarjeta de crédito bancaria', 'Control total de gastos']
        },
        {
            title: '🛍️ Comercios Locales',
            description: 'Paga directamente en supermercados, farmacias y tiendas en Venezuela que aceptan Binance Pay o transferencias USDT.',
            benefits: ['Rápido y seguro', 'Evita el cambio de efectivo', 'Cada vez más aceptado en el país']
        }
    ];

    // ============================================
    // DATOS: Quiz por sección (POOL EXPANDIDO para variedad)
    // ============================================
    const quizzes: Record<string, QuizQuestion[]> = {
        glosario: [
            {
                question: '¿Qué es una Stablecoin?',
                options: [
                    'Una criptomoneda que sube mucho de precio',
                    'Una criptomoneda con valor estable vinculada al dólar',
                    'Un tipo de billetera física',
                    'Una red de blockchain'
                ],
                correctIndex: 1
            },
            {
                question: '¿Qué es la Seed Phrase?',
                options: [
                    'La contraseña de tu email',
                    'El nombre de tu billetera',
                    '12-24 palabras para recuperar tu billetera',
                    'La dirección pública de tu wallet'
                ],
                correctIndex: 2
            },
            {
                question: '¿Cuál red tiene las comisiones (gas fees) más económicas?',
                options: [
                    'Ethereum (ERC20)',
                    'Bitcoin',
                    'TRC20 (Tron)',
                    'Todas cuestan igual'
                ],
                correctIndex: 2
            },
            {
                question: '¿Qué significa P2P en cripto?',
                options: [
                    'Pay to Pay - pagos automáticos',
                    'Peer-to-Peer - intercambio directo entre personas',
                    'Price to Price - comparador de precios',
                    'Private to Public - transferencia de claves'
                ],
                correctIndex: 1
            },
            {
                question: '¿Qué es un Exchange?',
                options: [
                    'Una billetera física',
                    'Una plataforma para comprar/vender criptomonedas',
                    'Un tipo de criptomoneda',
                    'Un contrato inteligente'
                ],
                correctIndex: 1
            },
            {
                question: '¿Qué es KYC?',
                options: [
                    'Un tipo de criptomoneda',
                    'Verificación de identidad en plataformas',
                    'Una red de blockchain',
                    'Un método de pago'
                ],
                correctIndex: 1
            },
            {
                question: '¿Qué es una Hot Wallet?',
                options: [
                    'Una billetera conectada a internet',
                    'Una billetera física sin conexión',
                    'Un tipo de exchange',
                    'Una criptomoneda'
                ],
                correctIndex: 0
            },
            {
                question: '¿Qué es un Smart Contract?',
                options: [
                    'Un documento legal tradicional',
                    'Un contrato autoejecutable en blockchain',
                    'Un tipo de billetera',
                    'Una moneda estable'
                ],
                correctIndex: 1
            },
            {
                question: '¿Cuál es el símbolo de Tether (dólar cripto)?',
                options: [
                    'BTC',
                    'ETH',
                    'USDT',
                    'USD'
                ],
                correctIndex: 2
            },
            {
                question: '¿Qué es la Clave Privada?',
                options: [
                    'Tu nombre de usuario',
                    'La dirección para recibir cripto',
                    'Código secreto que da control total de tus fondos',
                    'El número de tu billetera'
                ],
                correctIndex: 2
            }
        ],
        guias: [
            {
                question: '¿Qué NUNCA debes hacer con tu Seed Phrase?',
                options: [
                    'Escribirla en papel',
                    'Guardarla en un lugar seguro',
                    'Compartirla con soporte técnico',
                    'Verificar que las palabras estén correctas'
                ],
                correctIndex: 2
            },
            {
                question: 'Al comprar en Binance P2P, ¿qué debes hacer después de pagar?',
                options: [
                    'Cancelar la orden',
                    'Marcar la orden como "Pagado" en Binance',
                    'Cerrar la aplicación',
                    'Esperar sin hacer nada'
                ],
                correctIndex: 1
            },
            {
                question: '¿Qué pasa si envías USDT a una red incorrecta?',
                options: [
                    'Llega igual pero tarda más',
                    'Te cobran una pequeña comisión extra',
                    'Puedes perder todos los fondos',
                    'El sistema lo corrige automáticamente'
                ],
                correctIndex: 2
            },
            {
                question: '¿Qué debes verificar antes de enviar criptomonedas?',
                options: [
                    'Solo el monto',
                    'La dirección y la red de destino',
                    'Solo la fecha',
                    'El nombre del destinatario'
                ],
                correctIndex: 1
            },
            {
                question: '¿Dónde debes descargar Trust Wallet?',
                options: [
                    'Cualquier página web',
                    'Solo de la tienda oficial (App Store/Google Play)',
                    'Por enlaces en redes sociales',
                    'Buscando en Google'
                ],
                correctIndex: 1
            },
            {
                question: '¿Qué indica el tilde amarillo en un comerciante de Binance P2P?',
                options: [
                    'Que es nuevo',
                    'Que está verificado',
                    'Que tiene precios altos',
                    'Que está inactivo'
                ],
                correctIndex: 1
            },
            {
                question: 'Si ya pagaste en P2P pero el vendedor no libera, ¿qué debes hacer?',
                options: [
                    'Cancelar la orden inmediatamente',
                    'Abrir una apelación y esperar',
                    'Hacer otro pago',
                    'Crear una cuenta nueva'
                ],
                correctIndex: 1
            },
            {
                question: '¿Cuántas palabras típicamente tiene una Seed Phrase?',
                options: [
                    '6 palabras',
                    '8 palabras',
                    '12 o 24 palabras',
                    '4 palabras'
                ],
                correctIndex: 2
            }
        ]
    };

    const cardClass = `p-6 rounded-3xl shadow-lg border transition-all ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} hover:shadow-xl`;
    const pillClassActive = "bg-[#f3ba2f] text-gray-900 shadow-md transform scale-105";
    const pillClassInactive = isDark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200";

    return (
        <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <div className="w-full max-w-[98%] mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-5xl font-black mb-6 flex items-center justify-center gap-4">
                        <BookOpenIcon className="h-12 w-12 text-[#f3ba2f]" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f3ba2f] to-orange-500">
                            Centro Educativo
                        </span>
                    </h1>
                    <p className={`text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Domina el ecosistema cripto en Venezuela. Aprende, aplica y protege tus activos con nuestras guías y recursos.
                    </p>
                    {/* Progreso global */}
                    {completedSections.length > 0 && (
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                            <span>🏆</span>
                            {completedSections.length} módulo{completedSections.length > 1 ? 's' : ''} completado{completedSections.length > 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* Selector de sección */}
                <div className="flex justify-center mb-16">
                    <div className={`inline-flex p-1.5 rounded-full ${isDark ? 'bg-gray-800/80' : 'bg-white shadow-sm'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <button
                            onClick={() => { setActiveSection('glosario'); setShowQuiz(null); }}
                            className={`px-8 py-3 rounded-full font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${activeSection === 'glosario' ? pillClassActive : pillClassInactive}`}
                        >
                            <BookOpenIcon className="h-5 w-5" />
                            Glosario
                            {completedSections.includes('glosario') && <span className="text-green-500">✓</span>}
                        </button>
                        <button
                            onClick={() => { setActiveSection('guias'); setShowQuiz(null); }}
                            className={`px-8 py-3 rounded-full font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${activeSection === 'guias' ? pillClassActive : pillClassInactive}`}
                        >
                            <LightBulbIcon className="h-5 w-5" />
                            Guías
                            {completedSections.includes('guias') && <span className="text-green-500">✓</span>}
                        </button>
                        <button
                            onClick={() => { setActiveSection('casos'); setShowQuiz(null); }}
                            className={`px-8 py-3 rounded-full font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${activeSection === 'casos' ? pillClassActive : pillClassInactive}`}
                        >
                            <MapIcon className="h-5 w-5" />
                            Casos de Uso
                        </button>
                    </div>
                </div>

                {/* ============================================ */}
                {/* SECCIÓN: GLOSARIO */}
                {/* ============================================ */}
                {activeSection === 'glosario' && (
                    <div className="space-y-6">
                        {/* Lista de términos */}
                        <div className="space-y-4 w-full">
                            {glossaryTerms.map((item, index) => (
                                <div
                                    key={index}
                                    className={`rounded-2xl overflow-hidden transition-all duration-300 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} ${expandedTerm === item.term ? 'shadow-lg ring-2 ring-[#f3ba2f]/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                                >
                                    <button
                                        onClick={() => toggleTerm(item.term)}
                                        className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
                                    >
                                        <h3 className={`text-xl sm:text-2xl font-bold ${expandedTerm === item.term ? 'text-[#f3ba2f]' : isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                                            {item.term}
                                        </h3>
                                        <div className={`p-2 rounded-full transition-transform duration-300 ${expandedTerm === item.term ? 'bg-[#f3ba2f]/20 rotate-180' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                            <ArrowDownIcon className={`h-6 w-6 ${expandedTerm === item.term ? 'text-[#f3ba2f]' : 'text-gray-500'}`} />
                                        </div>
                                    </button>

                                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedTerm === item.term ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-700/50">
                                            <div className="flex flex-col md:flex-row gap-6 mt-4">
                                                <div className="flex-1">
                                                    <p className={`text-lg leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                        {item.definition}
                                                    </p>
                                                    <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                                        <span className="font-bold block mb-2 text-[#f3ba2f] flex items-center gap-2">
                                                            <LightBulbIcon className="h-5 w-5" />
                                                            Ejemplo Real:
                                                        </span>
                                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            {item.examples}
                                                        </p>
                                                    </div>
                                                </div>
                                                {item.image && (
                                                    <div className="md:w-1/3 flex items-center justify-center bg-white dark:bg-gray-900/50 rounded-xl p-4">
                                                        <img
                                                            src={item.image}
                                                            alt={`Ilustración de ${item.term}`}
                                                            className="max-h-40 object-contain"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quiz del Glosario */}
                        <div className="mt-12">
                            {showQuiz === 'glosario' ? (
                                <Quiz
                                    allQuestions={quizzes.glosario}
                                    questionsPerQuiz={4}
                                    sectionName="Glosario"
                                    onComplete={() => handleQuizComplete('glosario')}
                                    onNewQuiz={() => { }}
                                    isDark={isDark}
                                />
                            ) : (
                                <div className={`p-6 rounded-2xl text-center ${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-gray-50 to-gray-100'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <h3 className="text-2xl font-bold mb-3">🧠 ¿Listo para probar tus conocimientos?</h3>
                                    <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Responde el quiz y obtén tu certificación del módulo de Glosario
                                    </p>
                                    <button
                                        onClick={() => setShowQuiz('glosario')}
                                        className="px-8 py-4 bg-[#f3ba2f] text-gray-900 rounded-xl font-bold text-lg hover:bg-[#d9a526] transition-colors shadow-lg"
                                    >
                                        Comenzar Quiz →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ============================================ */}
                {/* SECCIÓN: GUÍAS */}
                {/* ============================================ */}
                {activeSection === 'guias' && (
                    <div className="space-y-8">
                        {guides.map((guide, index) => (
                            <div key={index} className={cardClass}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b pb-4 border-gray-100 dark:border-gray-700">
                                    <h3 className="text-2xl font-bold flex items-center gap-3">
                                        <span className="bg-[#f3ba2f] text-gray-900 rounded-lg w-10 h-10 flex items-center justify-center text-lg font-black shadow-sm">
                                            {index + 1}
                                        </span>
                                        {guide.title}
                                    </h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Pasos */}
                                    <div>
                                        <h4 className={`font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                            <LightBulbIcon className="h-5 w-5 text-[#f3ba2f]" />
                                            Pasos a seguir:
                                        </h4>
                                        <ol className="space-y-4">
                                            {guide.steps.map((step, i) => (
                                                <li key={i} className={`flex items-start gap-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 text-gray-500 dark:text-gray-400">
                                                        {i + 1}
                                                    </div>
                                                    <span className="text-sm leading-relaxed">{step}</span>
                                                </li>
                                            ))}
                                        </ol>

                                        {/* Warning */}
                                        <div className={`mt-6 rounded-2xl p-4 border-l-4 ${isDark ? 'bg-orange-900/10 border-orange-500' : 'bg-orange-50 border-orange-500'}`}>
                                            <div className="flex items-center gap-2 mb-2 text-orange-600 dark:text-orange-400 font-bold">
                                                <span className="text-xl">⚠️</span>
                                                Advertencia de Seguridad
                                            </div>
                                            <p className={`text-sm leading-relaxed ${isDark ? 'text-orange-200' : 'text-orange-800'}`}>
                                                {guide.warning.replace('⚠️ ', '')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Video embebido */}
                                    <div className="flex flex-col justify-center">
                                        <h4 className={`font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                            <VideoCameraIcon className="h-5 w-5 text-red-500" />
                                            Video Tutorial:
                                        </h4>
                                        <YouTubeEmbed videoUrl={guide.videoUrl} title={guide.title} />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Quiz de Guías */}
                        <div className="mt-12">
                            {showQuiz === 'guias' ? (
                                <Quiz
                                    allQuestions={quizzes.guias}
                                    questionsPerQuiz={3}
                                    sectionName="Guías"
                                    onComplete={() => handleQuizComplete('guias')}
                                    onNewQuiz={() => { }}
                                    isDark={isDark}
                                />
                            ) : (
                                <div className={`p-6 rounded-2xl text-center ${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-gray-50 to-gray-100'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <h3 className="text-2xl font-bold mb-3">📝 Evalúa tu aprendizaje</h3>
                                    <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        ¿Comprendiste las guías? Demuéstralo con el quiz
                                    </p>
                                    <button
                                        onClick={() => setShowQuiz('guias')}
                                        className="px-8 py-4 bg-[#f3ba2f] text-gray-900 rounded-xl font-bold text-lg hover:bg-[#d9a526] transition-colors shadow-lg"
                                    >
                                        Comenzar Quiz →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ============================================ */}
                {/* SECCIÓN: CASOS DE USO */}
                {/* ============================================ */}
                {activeSection === 'casos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {useCases.map((useCase, index) => (
                            <div key={index} className={`${cardClass} hover:border-[#f3ba2f]/30`}>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                                    <span className="text-3xl bg-gray-100 dark:bg-gray-700 p-2 rounded-xl">{useCase.title.split(' ')[0]}</span>
                                    <span>{useCase.title.split(' ').slice(1).join(' ')}</span>
                                </h3>
                                <p className={`mb-6 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{useCase.description}</p>
                                <div className="space-y-3 bg-gray-50 dark:bg-gray-700/30 p-5 rounded-2xl">
                                    {useCase.benefits.map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                                <span className="text-green-600 dark:text-green-400 text-xs font-bold">✓</span>
                                            </div>
                                            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Education;
