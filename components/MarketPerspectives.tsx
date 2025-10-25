
import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface PerspectiveItemProps {
  text: string;
}

const AdvantageItem: React.FC<PerspectiveItemProps> = ({ text }) => (
  <div className="bg-gray-700/50 p-4 rounded-lg text-gray-300 text-sm">{text}</div>
);

const DisadvantageItem: React.FC<PerspectiveItemProps> = ({ text }) => (
  <div className="bg-gray-700/50 p-4 rounded-lg text-gray-300 text-sm">{text}</div>
);

const MarketPerspectives: React.FC = () => {
  const advantages = [
    "Cobertura contra la devaluación del bolívar y la hiperinflación.",
    "Facilita el envío y recepción de remesas sin intermediarios bancarios.",
    "Permite realizar pagos y transacciones internacionales de forma más accesible.",
    "Otorga autonomía financiera al no depender de entidades bancarias tradicionales."
  ];

  const disadvantages = [
    "La alta volatilidad de precios genera un riesgo elevado de pérdida de valor.",
    "Requiere un nivel de conocimiento técnico que puede ser una barrera para muchos.",
    "El marco legal es ambiguo y puede cambiar, generando incertidumbre.",
    "Existe un riesgo constante de ser víctima de estafas o ciberataques."
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-full">
      <h2 className="text-xl font-bold text-center mb-6">Perspectivas del Mercado</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="flex items-center text-lg font-semibold text-green-400 mb-4">
            <CheckCircleIcon className="h-6 w-6 mr-2" />
            Ventajas
          </h3>
          <div className="space-y-4">
            {advantages.map((text, index) => <AdvantageItem key={index} text={text} />)}
          </div>
        </div>
        <div>
          <h3 className="flex items-center text-lg font-semibold text-red-400 mb-4">
            <XCircleIcon className="h-6 w-6 mr-2" />
            Desventajas
          </h3>
          <div className="space-y-4">
            {disadvantages.map((text, index) => <DisadvantageItem key={index} text={text} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPerspectives;
