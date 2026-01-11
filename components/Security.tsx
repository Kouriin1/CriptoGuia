import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
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
        { id: '2fa', item: '¿Tienes activado el 2FA en tus exchanges?', critical: true },
        { id: 'seed_offline', item: '¿Tu seed phrase está guardada en un lugar seguro offline?', critical: true },
        { id: 'unique_pwd', item: '¿Usas contraseñas diferentes para cada plataforma?', critical: true },
        { id: 'verify_addr', item: '¿Verificas las direcciones antes de enviar cripto?', critical: true },
        { id: 'suspicious_msgs', item: '¿Desconfías de mensajes no solicitados sobre criptomonedas?', critical: false },
        { id: 'update_apps', item: '¿Actualizas regularmente tus aplicaciones de wallet?', critical: false },
        { id: 'privacy', item: '¿Evitas hablar públicamente de cuánto tienes en cripto?', critical: false },
        { id: 'cold_wallet', item: '¿Usas una wallet diferente para montos grandes (cold wallet)?', critical: false },
    ];

    // State for checklist persistence
    const [checkedState, setCheckedState] = useState<Record<string, boolean>>(() => {
        const saved = localStorage.getItem('security_checklist_progress');
        return saved ? JSON.parse(saved) : {};
    });

    const [score, setScore] = useState(0);

    useEffect(() => {
        localStorage.setItem('security_checklist_progress', JSON.stringify(checkedState));

        // Calculate score
        const totalItems = securityChecklist.length;
        const checkedCount = Object.values(checkedState).filter(Boolean).length;
        setScore(Math.round((checkedCount / totalItems) * 100));
    }, [checkedState]);

    const handleCheck = (id: string) => {
        setCheckedState(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getLevelInfo = (score: number) => {
        if (score < 50) return { label: 'Vulnerable 😟', color: 'text-red-500', barColor: 'bg-red-500' };
        if (score < 80) return { label: 'Precavido 🤔', color: 'text-yellow-500', barColor: 'bg-yellow-500' };
        return { label: 'Fortaleza Cripto 🛡️', color: 'text-green-500', barColor: 'bg-green-500' };
    };

    const levelInfo = getLevelInfo(score);

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

                {/* Contexto Venezuela */}
                <div className={`${cardBg} p-6 rounded-xl border-l-4 border-yellow-500 shadow-lg mb-8`}>
                    <h2 className="text-2xl font-bold mb-4 flex items-center text-yellow-600">
                        <span className="mr-2">🇻🇪</span>
                        Contexto Venezuela: Medidas Críticas
                    </h2>
                    <div className="space-y-4">
                        <div className={`p-4 rounded-lg ${isDark ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                            <h3 className="font-bold flex items-center mb-2 text-yellow-600">
                                🏦 Seguridad Bancaria
                            </h3>
                            <p className={`${textSecondary} mb-2`}>
                                Por normativas de la Sudeban, evita a toda costa usar términos relacionados con criptomonedas en tus transferencias bancarias.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                <div className="flex-1 bg-red-100 dark:bg-red-900/30 p-3 rounded border border-red-200 dark:border-red-800">
                                    <span className="text-red-600 dark:text-red-400 font-bold block text-sm mb-1">NUNCA PONGAS:</span>
                                    <p className="text-sm text-red-700 dark:text-red-300">"USDT", "Binance", "Compra Cripto", "Gana dinero", "BTC"</p>
                                </div>
                                <div className="flex-1 bg-green-100 dark:bg-green-900/30 p-3 rounded border border-green-200 dark:border-green-800">
                                    <span className="text-green-600 dark:text-green-400 font-bold block text-sm mb-1">USA EN SU LUGAR:</span>
                                    <p className="text-sm text-green-700 dark:text-green-300">"Servicios", "Pago personal", "Asesoría", o déjalo en blanco.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                                <h3 className="font-bold mb-2 flex items-center">
                                    🔌 Infraestructura
                                </h3>
                                <p className={`${textSecondary} text-sm`}>
                                    Los bajones de luz y fallas de internet son comunes. Si haces trading activo:
                                </p>
                                <ul className={`list-disc list-inside mt-2 text-sm ${textSecondary}`}>
                                    <li>Ten siempre la app móvil instalada y logueada.</li>
                                    <li>Mantén tu teléfono con carga y datos móviles.</li>
                                    <li>Usa órdenes Limit o Stop-Loss, evita órdenes de Mercado si tu conexión es inestable.</li>
                                </ul>
                            </div>

                            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                                <h3 className="font-bold mb-2 flex items-center">
                                    ⚠️ Triangulación P2P
                                </h3>
                                <p className={`${textSecondary} text-sm`}>
                                    Una estafa común en P2P (Binance/El Dorado):
                                </p>
                                <ul className={`list-disc list-inside mt-2 text-sm ${textSecondary}`}>
                                    <li>Un tercero te transfiere Bolívares.</li>
                                    <li>El estafador te pide liberar los USDT.</li>
                                    <li><span className="font-bold text-red-500">REGLA DE ORO:</span> Solo acepta pagos de cuentas bancarias que coincidan EXACTAMENTE con el nombre del usuario en la plataforma.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score & Progress */}
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg mb-8 sticky top-4 z-10 transition-all duration-300`}>
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <h2 className="text-xl font-bold">Tu Nivel de Seguridad</h2>
                            <p className={`text-sm ${textSecondary}`}>Completa el checklist para subir de nivel</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-2xl font-bold ${levelInfo.color}`}>{levelInfo.label}</span>
                            <p className="text-sm font-bold">{score}% Seguro</p>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 overflow-hidden">
                        <div
                            className={`${levelInfo.barColor} h-4 rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${score}%` }}
                        ></div>
                    </div>
                </div>

                {/* Checklist de Seguridad */}
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg mb-8`}>
                    <h2 className="text-2xl font-bold mb-4">✅ Checklist Interactivo</h2>
                    <div className="space-y-4">
                        {securityChecklist.map((check, index) => (
                            <motion.div
                                key={check.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleCheck(check.id)}
                                className={`p-4 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-opacity-80 
                                    ${checkedState[check.id]
                                        ? (isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200')
                                        : (isDark ? 'bg-gray-700/50' : 'bg-gray-100')}
                                    ${check.critical && !checkedState[check.id] ? 'border-l-4 border-l-red-500' : ''}
                                `}
                            >
                                <div className="flex items-center">
                                    <div className={`
                                        flex-shrink-0 h-6 w-6 rounded border-2 flex items-center justify-center mr-3 transition-colors
                                        ${checkedState[check.id]
                                            ? 'bg-green-500 border-green-500'
                                            : 'border-gray-400'}
                                    `}>
                                        {checkedState[check.id] && <CheckCircleIcon className="h-4 w-4 text-white" />}
                                    </div>
                                    <div className="select-none flex-1">
                                        <label className={`cursor-pointer ${checkedState[check.id] ? 'line-through opacity-60' : ''} ${textColor}`}>
                                            {check.item}
                                        </label>
                                        {check.critical && !checkedState[check.id] && (
                                            <span className="ml-2 text-xs text-red-500 font-bold animate-pulse">CRÍTICO</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {score === 100 && (
                        <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg text-center animate-bounce">
                            🎉 ¡Excelente trabajo! Has tomado todas las precauciones recomendadas.
                        </div>
                    )}
                </div>

                {/* Mejores Prácticas (Compacto) */}
                <div className={`${cardBg} p-6 rounded-xl border ${borderColor} shadow-lg mb-8`}>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <ShieldCheckIcon className="h-7 w-7 mr-2 text-green-500" />
                        Tips Rápidos
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {bestPractices.map((practice, index) => (
                            <div key={index} className="flex items-start">
                                <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className={textSecondary}>{practice}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Estafas (Acordeón o Grid compacto) */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <AlertTriangleIcon className="h-7 w-7 mr-2 text-red-500" />
                        Archivo de Estafas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {commonScams.map((scam, index) => (
                            <div key={index} className={`${cardBg} p-4 rounded-xl border ${borderColor} shadow hover:shadow-lg transition-shadow`}>
                                <h3 className="font-bold text-red-500 mb-1">{scam.type}</h3>
                                <p className={`${textSecondary} text-sm mb-2 line-clamp-2 hover:line-clamp-none`}>{scam.description}</p>
                                <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                                    🚨 {scam.warning}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Security;
