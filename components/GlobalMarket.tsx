
import React from 'react';
import type { CryptoAsset } from '../types';
import { ArrowUpIcon, ArrowDownIcon } from './icons';


const marketData: CryptoAsset[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 68123.45, change24h: 2.5 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3540.12, change24h: -1.2 },
  { id: 'tether', name: 'Tether', symbol: 'USDT', price: 1.00, change24h: 0.01 },
];

const GlobalMarket: React.FC = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-full">
      <h2 className="text-xl font-bold mb-4">Mercado Global (USD)</h2>
      <div className="space-y-3">
        <div className="flex justify-between text-xs text-gray-400 font-bold px-2">
            <span>ACTIVO</span>
            <span>PRECIO (USD)</span>
        </div>
        {marketData.map(asset => (
          <div key={asset.id} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
            <div className="flex items-center">
              <div className="font-bold">{asset.symbol}</div>
              <div className="text-gray-400 text-sm ml-2 hidden sm:block">{asset.name}</div>
            </div>
            <div className="text-right">
                <div className="font-semibold">${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={`flex items-center justify-end text-xs ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.change24h >= 0 ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                    <span>{Math.abs(asset.change24h)}%</span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalMarket;
