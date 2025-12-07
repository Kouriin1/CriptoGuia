import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpenIcon, LightBulbIcon, MapIcon } from './icons';

const Education: React.FC = () => {
    const { isDark } = useTheme();
    const [activeSection, setActiveSection] = useState<'glosario' | 'guias' | 'casos'>('glosario');

    const glossaryTerms = [
        {
            term: 'Blockchain',
            definition: 'Cadena de bloques, es un registro digital distribuido e inmutable donde se almacenan las transacciones de criptomonedas.'
        },
        {
            term: 'Wallet (Billetera)',
            definition: 'Aplicación que permite almacenar, enviar y recibir criptomonedas. Puede ser hot (en línea) o cold (offline).'
        },
        {
            term: 'Stablecoin',
            definition: 'Criptomoneda diseñada para mantener un valor estable, generalmente vinculada al dólar. Ejemplo: USDT, USDC.'
        },
        {
            term: 'P2P (Peer-to-Peer)',
            definition: 'Intercambio directo entre personas sin intermediarios. Común en Venezuela para comprar/vender cripto.'
        },
        {
            term: 'Gas Fees',
            definition: 'Comisiones que se pagan por realizar transacciones en una blockchain, especialmente en Ethereum.'
        },
        {
            term: 'KYC (Know Your Customer)',
            definition: 'Proceso de verificación de identidad requerido por algunos exchanges para cumplir regulaciones.'
        },
        {
            term: 'Exchange',
            definition: 'Plataforma donde puedes comprar, vender e intercambiar criptomonedas. Ejemplos: Binance, Coinbase.'
        },
        {
            term: 'Clave Privada',
            definition: 'Contraseña secreta que te da acceso a tus criptomonedas. NUNCA la compartas con nadie.'
        },
        {
            term: 'Seed Phrase',
            definition: '12-24 palabras que permiten recuperar tu wallet. Guárdala en un lugar seguro offline.'
        },
        {
            term: 'DeFi',
            definition: 'Finanzas Descentralizadas. Servicios financieros sin intermediarios bancarios, usando smart contracts.'
        }
    ];

    const guides = [
        {
            title: '¿Cómo instalar Trust Wallet?',
            steps: [
                '1. Descarga Trust Wallet desde la App Store (iOS) o Google Play (Android)',
                '2. Abre la app y selecciona "Crear una nueva billetera"',
                '3. Lee y acepta los términos de servicio',
                '4. IMPORTANTE: Anota tu Seed Phrase de 12 palabras en papel (no captura de pantalla)',
                '5. Verifica que anotaste correctamente las palabras en orden',
                '6. Crea un PIN de seguridad',
                '7. ¡Listo! Ya puedes recibir criptomonedas en tu wallet'
            ],
            warning: '⚠️ Nunca compartas tu Seed Phrase. Si alguien la obtiene, puede robar todas tus criptomonedas.'
        },
        {
            title: '¿Cómo comprar USDT en modo P2P?',
            steps: [
                '1. Regístrate en Binance o un exchange con P2P disponible en Venezuela',
                '2. Completa la verificación básica (KYC)',
                '3. Ve a la sección "P2P Trading"',
                '4. Selecciona USDT y tu método de pago (Transferencia bancaria, Zelle, etc.)',
                '5. Elige un vendedor con buena reputación (+ 98% de calificación)',
                '6. Ingresa el monto que deseas comprar',
                '7. Realiza la transferencia SOLO a la cuenta indicada',
                '8. Una vez transferido, marca como "Pagado" en la plataforma',
                '9. Espera a que el vendedor libere los USDT (usualmente 5-15 min)'
            ],
            warning: '⚠️ NUNCA transfieras a cuentas diferentes a las mostradas en la plataforma.'
        },
        {
            title: '¿Cómo enviar criptomonedas de forma segura?',
            steps: [
                '1. Verifica que tienes la dirección correcta del destinatario',
                '2. Comprueba dos veces la dirección (usa copiar y pegar, no escribir)',
                '3. Verifica que la red es correcta (ERC-20 para USDT en Ethereum, BEP-20 para Binance Smart Chain)',
                '4. Haz una transacción de prueba pequeña primero',
                '5. Confirma que llegó correctamente',
                '6. Luego envía el monto completo',
                '7. Guarda el hash de la transacción como comprobante'
            ],
            warning: '⚠️ Las transacciones de criptomonedas son irreversibles. Revisa todo antes de enviar.'
        }
    ];

    const useCases = [
        {
            title: '💸 Recibir Remesas del Extranjero',
            description: 'Tus familiares en el exterior te envían USDT desde cualquier país. Tú lo recibes en minutos en tu wallet y luego lo vendes por bolívares en P2P.',
            benefits: ['Sin comisiones bancarias altas', 'Llegada en minutos, no días', 'Mejor tasa de cambio']
        },
        {
            title: '💰 Ahorrar contra la Inflación',
            description: 'En lugar de mantener bolívares que se devalúan, conviertes tus ahorros a USDT (stablecoin), manteniendo su valor en dólares.',
            benefits: ['Protección contra devaluación', 'Acceso 24/7', 'No necesitas cuenta bancaria en USD']
        },
        {
            title: '🛒 Pagar Servicios Digitales',
            description: 'Muchos servicios internacionales (hosting, software, cursos online) aceptan criptomonedas, evitando problemas con tarjetas de crédito venezolanas.',
            benefits: ['Pagos internacionales sin restricciones', 'Sin necesidad de tarjeta de crédito internacional', 'Instantáneo']
        },
        {
            title: '🏪 Comprar en Comercios Locales',
            description: 'Cada vez más negocios en Venezuela aceptan pagos en USDT o Bitcoin, desde restaurantes hasta tiendas online.',
            benefits: ['Pago directo sin intermediarios', 'Evita problemas con puntos de venta', 'Confirmación inmediata']
        }
    ];

    const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
    const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';
    const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

    return (
        <div className={`${bgColor} ${textColor} min-h-screen p-4 sm:p-6 lg:p-8`}>
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold mb-6 text-center">📚 Centro Educativo</h1>

                {/* Selector de sección */}
                <div className="flex gap-4 mb-8 justify-center flex-wrap">
                    <button
                        onClick={() => setActiveSection('glosario')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${activeSection === 'glosario'
                                ? 'bg-[#f3ba2f] text-gray-900'
                                : cardBg + ' ' + textSecondary
                            }`}
                    >
                        <BookOpenIcon className="inline h-5 w-5 mr-2" />
                        Glosario
                    </button>
                    <button
                        onClick={() => setActiveSection('guias')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${activeSection === 'guias'
                                ? 'bg-[#f3ba2f] text-gray-900'
                                : cardBg + ' ' + textSecondary
                            }`}
                    >
                        <LightBulbIcon className="inline h-5 w-5 mr-2" />
                        Guías Paso a Paso
                    </button>
                    <button
                        onClick={() => setActiveSection('casos')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${activeSection === 'casos'
                                ? 'bg-[#f3ba2f] text-gray-900'
                                : cardBg + ' ' + textSecondary
                            }`}
                    >
                        <MapIcon className="inline h-5 w-5 mr-2" />
                        Casos de Uso
                    </button>
                </div>

                {/* Contenido según sección activa */}
                {activeSection === 'glosario' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {glossaryTerms.map((item, index) => (
                            <div key={index} className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg`}>
                                <h3 className="text-xl font-bold text-[#f3ba2f] mb-2">{item.term}</h3>
                                <p className={textSecondary}>{item.definition}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeSection === 'guias' && (
                    <div className="space-y-8">
                        {guides.map((guide, index) => (
                            <div key={index} className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg`}>
                                <h3 className="text-2xl font-bold mb-4">{guide.title}</h3>
                                <ol className="space-y-3 mb-4">
                                    {guide.steps.map((step, i) => (
                                        <li key={i} className={`${textSecondary} leading-relaxed`}>
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                                <div className={`${isDark ? 'bg-orange-900/30' : 'bg-orange-100'} border-l-4 border-orange-500 p-4 rounded`}>
                                    <p className={isDark ? 'text-orange-200' : 'text-orange-800'}>{guide.warning}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeSection === 'casos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {useCases.map((useCase, index) => (
                            <div key={index} className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg`}>
                                <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                                <p className={`${textSecondary} mb-4`}>{useCase.description}</p>
                                <div className="space-y-2">
                                    {useCase.benefits.map((benefit, i) => (
                                        <div key={i} className="flex items-start">
                                            <span className="text-green-500 mr-2">✓</span>
                                            <span className={textSecondary}>{benefit}</span>
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
