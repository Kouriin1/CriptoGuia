import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ShieldCheckIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon } from './icons';

const Security: React.FC = () => {
    const { isDark } = useTheme();

    const bestPractices = [
        'Nunca compartas tu clave privada o seed phrase con nadie',
        'Usa autenticación de dos factores (2FA) en todos tus exchanges',
        'Guarda tu seed phrase en papel, no en formato digital',
        'Verifica siempre las direcciones de wallet antes de enviar',
        'Usa wallets oficiales descargadas desde sitios oficiales',
        'No hagas clic en enlaces sospechosos de emails o mensajes',
        'Mantén tu software y apps actualizadas',
        'Usa contraseñas fuertes y únicas para cada plataforma',
        'Desconfía de promesas de ganancias garantizadas',
        'Haz transacciones de prueba con montos pequeños primero'
    ];

    const commonScams = [
        {
            type: 'Phishing',
            description: 'Sitios web falsos que imitan a exchanges reales para robar tus credenciales.',
            warning: 'Verifica siempre la URL. Binance.com NO es Binanse.com o Blnance.com'
        },
        {
            type: 'Esquemas Ponzi',
            description: 'Proyectos que prometen retornos irreales (ej: "duplica tu dinero en 24 horas").',
            warning: 'Si suena demasiado bueno para ser verdad, probablemente sea una estafa.'
        },
        {
            type: 'Wallets Falsas',
            description: 'Apps maliciosas en tiendas que roban tus criptomonedas.',
            warning: 'Descarga wallets solo desde sitios oficiales, no de enlaces de terceros.'
        },
        {
            type: 'Soporte Falso',
            description: 'Personas que se hacen pasar por soporte técnico y piden tu seed phrase.',
            warning: 'El soporte NUNCA te pedirá tu clave privada o seed phrase.'
        },
        {
            type: 'Pump and Dump',
            description: 'Grupos que inflan artificialmente el precio de una criptomoneda para vender alto.',
            warning: 'No sigas señales de trading de grupos anónimos en Telegram.'
        },
        {
            type: 'Airdrop Falsos',
            description: 'Promesas de criptomonedas gratis a cambio de conectar tu wallet.',
            warning: 'No conectes tu wallet a sitios desconocidos.'
        }
    ];

    const securityChecklist = [
        { item: '¿Tienes activado el 2FA en tus exchanges?', critical: true },
        { item: '¿Tu seed phrase está guardada en un lugar seguro offline?', critical: true },
        { item: '¿Usas contraseñas diferentes para cada plataforma?', critical: true },
        { item: '¿Verificas las direcciones antes de enviar cripto?', critical: true },
        { item: '¿Desconfías de mensajes no solicitados sobre criptomonedas?', critical: false },
        { item: '¿Actualizas regularmente tus aplicaciones de wallet?', critical: false },
        { item: '¿Evitas hablar públicamente de cuánto tienes en cripto?', critical: false },
        { item: '¿Usas una wallet diferente para montos grandes (cold wallet)?', critical: false },
    ];

    const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
    const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-300' : 'text-gray-700';
    const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

    return (
        <div className={`${bgColor} ${textColor} min-h-screen p-4 sm:p-6 lg:p-8`}>
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold mb-2 text-center">🛡️ Centro de Seguridad</h1>
                <p className={`${textSecondary} text-center mb-8`}>
                    Protégete de estafas y mantén tus criptomonedas seguras
                </p>

                {/* Mejores Prácticas */}
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg mb-8`}>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <ShieldCheckIcon className="h-7 w-7 mr-2 text-green-500" />
                        Mejores Prácticas de Seguridad
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bestPractices.map((practice, index) => (
                            <div key={index} className="flex items-start">
                                <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className={textSecondary}>{practice}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Estafas Comunes */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <AlertTriangleIcon className="h-7 w-7 mr-2 text-red-500" />
                        Estafas Comunes en Venezuela
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {commonScams.map((scam, index) => (
                            <div key={index} className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg`}>
                                <h3 className="text-xl font-bold text-red-500 mb-2">⚠️ {scam.type}</h3>
                                <p className={`${textSecondary} mb-3`}>{scam.description}</p>
                                <div className={`${isDark ? 'bg-red-900/30' : 'bg-red-100'} border-l-4 border-red-500 p-3 rounded`}>
                                    <p className={isDark ? 'text-red-200 text-sm' : 'text-red-800 text-sm'}>
                                        🚨 {scam.warning}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Checklist de Seguridad */}
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg`}>
                    <h2 className="text-2xl font-bold mb-4">✅ Checklist de Seguridad Personal</h2>
                    <p className={`${textSecondary} mb-6`}>
                        Responde honestamente a estas preguntas para evaluar tu nivel de seguridad:
                    </p>
                    <div className="space-y-4">
                        {securityChecklist.map((check, index) => (
                            <div key={index} className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} ${check.critical ? 'border-l-4 border-red-500' : ''}`}>
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id={`check-${index}`}
                                        className="mt-1 h-5 w-5 rounded border-gray-300 text-[#f3ba2f] focus:ring-[#f3ba2f]"
                                    />
                                    <label htmlFor={`check-${index}`} className={`ml-3 ${textSecondary} cursor-pointer`}>
                                        {check.item}
                                        {check.critical && (
                                            <span className="ml-2 text-xs text-red-500 font-bold">CRÍTICO</span>
                                        )}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={`${isDark ? 'bg-blue-900/30' : 'bg-blue-100'} border-l-4 border-blue-500 p-4 rounded mt-6`}>
                        <p className={isDark ? 'text-blue-200' : 'text-blue-800'}>
                            💡 <strong>Tip:</strong> Todos los items marcados como CRÍTICOS deberían tener un "Sí". Si alguno no lo tiene, tómalo como prioridad para mejorar tu seguridad.
                        </p>
                    </div>
                </div>

                {/* Señales de Alerta */}
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg mt-8`}>
                    <h2 className="text-2xl font-bold mb-4">🚩 Señales de Alerta (Red Flags)</h2>
                    <div className="space-y-3">
                        {[
                            'Te piden tu clave privada o seed phrase',
                            'Prometen ganancias garantizadas o muy altas',
                            'Presionan para que actúes rápido ("oferta limitada")',
                            'La oferta llegó por mensaje no solicitado',
                            'El sitio web tiene errores de ortografía',
                            'No hay información clara sobre el equipo detrás del proyecto',
                            'Te piden enviar cripto primero para "verificar tu cuenta"',
                            'El dominio del sitio es similar pero no exacto al oficial',
                        ].map((flag, index) => (
                            <div key={index} className="flex items-start">
                                <XCircleIcon className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                                <span className={textSecondary}>{flag}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Security;
