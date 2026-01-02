import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

const data = [
  { name: 'USDT (Stable)', value: 45, color: '#26A17B' },
  { name: 'Bitcoin (BTC)', value: 30, color: '#F7931A' },
  { name: 'Ethereum (ETH)', value: 15, color: '#627EEA' },
  { name: 'Altcoins', value: 10, color: '#f3ba2f' },
];

const AssetDistribution: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
        Distribución de Cartera
      </h2>
      <p className="text-xs text-gray-500 mb-6">Recomendación balanceada para perfil moderado</p>

      <div className="flex-1 min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#fff',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ color: isDark ? '#fff' : '#111', fontWeight: 'bold' }}
              formatter={(value: number) => [`${value}%`, '']}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-xs font-medium text-gray-600 dark:text-gray-300 ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-12">
          <div className="text-center">
            <span className="text-3xl font-black text-gray-900 dark:text-white">100%</span>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDistribution;
