import React from 'react';
import { motion } from 'framer-motion';

interface StockSelectorProps {
  onSymbolChange: (symbol: string) => void;
  currentSymbol: string;
}

const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
];

const StockSelector: React.FC<StockSelectorProps> = ({ onSymbolChange, currentSymbol }) => {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {stocks.map(({ symbol, name }) => (
        <motion.button
          key={symbol}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSymbolChange(symbol)}
          className={`px-4 py-2 rounded-lg ${
            currentSymbol === symbol
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
          } transition-colors duration-200`}
        >
          <span className="font-semibold">{symbol}</span>
          <span className="text-sm ml-2 opacity-75">{name}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default StockSelector;