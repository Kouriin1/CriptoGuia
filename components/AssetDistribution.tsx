
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'USDT', value: 45 },
  { name: 'BTC', value: 30 },
  { name: 'ETH', value: 15 },
  { name: 'Otros', value: 10 },
];

const COLORS = ['#f3ba2f', '#60a5fa', '#a78bfa', '#4b5563'];

const AssetDistribution: React.FC = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-full">
      <h2 className="text-xl font-bold mb-4">Distribución de Activos</h2>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#374151',
                border: 'none',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#d1d5db' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
       <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mt-4 text-xs">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center">
            <span className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></span>
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetDistribution;
