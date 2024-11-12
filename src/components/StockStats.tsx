import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

interface StockStatsProps {
  price: number;
  change: number;
  volume: number;
  high: number;
}

const StockStats: React.FC<StockStatsProps> = ({ price, change, volume, high }) => {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(num);
  };

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(2)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(2)}K`;
    return vol.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
    >
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <DollarSign size={18} />
          <span>Current Price</span>
        </div>
        <div className="text-2xl font-bold">${formatNumber(price)}</div>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          {change >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          <span>24h Change</span>
        </div>
        <div className={`text-2xl font-bold ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
          {change >= 0 ? '+' : ''}{formatNumber(change)}%
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <BarChart3 size={18} />
          <span>Volume</span>
        </div>
        <div className="text-2xl font-bold">{formatVolume(volume)}</div>
      </div>

      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-gray-400 mb-2">
          <TrendingUp size={18} />
          <span>24h High</span>
        </div>
        <div className="text-2xl font-bold">${formatNumber(high)}</div>
      </div>
    </motion.div>
  );
};

export default StockStats;