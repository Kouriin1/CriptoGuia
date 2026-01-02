import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpenIcon, LightBulbIcon, MapIcon, VideoCameraIcon, ArrowDownIcon } from './icons';

// Import images
import p2pImg from '../img/2p2.png';
import binanceImg from '../img/logo_binance.png';
import tetherImg from '../img/logo_tether.png';
import usdcImg from '../img/usdc_logo.png';
import kontigoImg from '../img/kontigo_logo.png';
import TrustWalletImg from '../img/trust-wallet.png';
import BinancePayImg from '../img/comprobante_binance.jpeg';

const Education: React.FC = () => {
    const { isDark } = useTheme();
    const [activeSection, setActiveSection] = useState<'glosario' | 'guias' | 'casos'>('glosario');
    const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

    const toggleTerm = (term: string) => {
        if (expandedTerm === term) {
            setExpandedTerm(null);
        } else {
            setExpandedTerm(term);
        }
    };

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

    const cardClass = `p-6 rounded-3xl shadow-lg border transition-all ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} hover:shadow-xl`;
    const pillClassActive = "bg-[#f3ba2f] text-gray-900 shadow-md transform scale-105";
    const pillClassInactive = isDark ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200";

    return (
        <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <div className="w-full max-w-[98%] mx-auto">
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
                </div>

                {/* Selector de sección */}
                <div className="flex justify-center mb-16">
                    <div className={`inline-flex p-1.5 rounded-full ${isDark ? 'bg-gray-800/80' : 'bg-white shadow-sm'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <button
                            onClick={() => setActiveSection('glosario')}
                            className={`px-8 py-3 rounded-full font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${activeSection === 'glosario' ? pillClassActive : pillClassInactive}`}
                        >
                            <BookOpenIcon className="h-5 w-5" />
                            Glosario
                        </button>
                        <button
                            onClick={() => setActiveSection('guias')}
                            className={`px-8 py-3 rounded-full font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${activeSection === 'guias' ? pillClassActive : pillClassInactive}`}
                        >
                            <LightBulbIcon className="h-5 w-5" />
                            Guías
                        </button>
                        <button
                            onClick={() => setActiveSection('casos')}
                            className={`px-8 py-3 rounded-full font-bold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${activeSection === 'casos' ? pillClassActive : pillClassInactive}`}
                        >
                            <MapIcon className="h-5 w-5" />
                            Casos de Uso
                        </button>
                    </div>
                </div>

                {/* Contenido según sección activa */}
                {activeSection === 'glosario' && (
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
                                
                                <div 
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedTerm === item.term ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                                >
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
                )}

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
                                    <a 
                                        href={guide.videoUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-semibold text-sm w-fit"
                                    >
                                        <VideoCameraIcon className="h-5 w-5" />
                                        Ver Tutorial en YouTube
                                    </a>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-8">
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
                                    </div>
                                    
                                    <div className="flex flex-col justify-center">
                                        <div className={`rounded-2xl p-6 border-l-4 ${isDark ? 'bg-orange-900/10 border-orange-500' : 'bg-orange-50 border-orange-500'}`}>
                                            <div className="flex items-center gap-2 mb-2 text-orange-600 dark:text-orange-400 font-bold">
                                                <span className="text-xl">⚠️</span>
                                                Advertencia de Seguridad
                                            </div>
                                            <p className={`text-sm leading-relaxed ${isDark ? 'text-orange-200' : 'text-orange-800'}`}>
                                                {guide.warning.replace('⚠️ ', '')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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
