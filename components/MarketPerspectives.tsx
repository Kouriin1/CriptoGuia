
import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface PerspectiveItemProps {
  text: string;
}
import { useTheme } from '../contexts/ThemeContext';
import { ArrowUpIcon, ArrowDownIcon } from './icons';

const MarketPerspectives: React.FC = () => {
  const { isDark } = useTheme();

  const advantages = [
    'Adopción creciente en comercios locales y pagos digitales.',
    'Alternativa sólida frente a la devaluación del Bolívar.',
    'Acceso a mercados globales sin restricciones bancarias.',
    'Velocidad y bajo costo en transacciones internacionales.',
  ];

  const disadvantages = [
    'Volatilidad alta en cortos periodos de tiempo.',
    'Riesgos de seguridad si no se gestionan bien las claves.',
    'Incertidumbre regulatoria en algunos aspectos legales.',
    'Curva de aprendizaje inicial para nuevos usuarios.',
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 h-full">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-[#f3ba2f] rounded-full"></span>
        Perspectivas del Mercado
      </h2>

      <div className="space-y-6">
        <div className="group">
          <h3 className="flex items-center text-green-600 dark:text-green-400 font-bold mb-3 text-sm uppercase tracking-wider">
            <span className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-lg mr-2 group-hover:scale-110 transition-transform">
              <ArrowUpIcon className="h-4 w-4" />
            </span>
            Ventajas
          </h3>
          <div className="space-y-3">
            {advantages.map((item, index) => (
              <div key={index} className="flex items-start p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                <span className="w-1.5 h-1.5 mt-2 rounded-full bg-green-500 mr-3 flex-shrink-0"></span>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="group">
          <h3 className="flex items-center text-red-600 dark:text-red-400 font-bold mb-3 text-sm uppercase tracking-wider">
            <span className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-lg mr-2 group-hover:scale-110 transition-transform">
              <ArrowDownIcon className="h-4 w-4" />
            </span>
            Desafíos
          </h3>
          <div className="space-y-3">
            {disadvantages.map((item, index) => (
              <div key={index} className="flex items-start p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <span className="w-1.5 h-1.5 mt-2 rounded-full bg-red-500 mr-3 flex-shrink-0"></span>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPerspectives;
