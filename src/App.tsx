import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart } from 'lucide-react';
import Chart from './components/Chart';
import StockSelector from './components/StockSelector';
import StockStats from './components/StockStats';

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const generateMockData = (symbol: string) => {
  const basePrice = {
    AAPL: 180,
    GOOGL: 140,
    MSFT: 370,
    AMZN: 175,
    TSLA: 180,
  }[symbol] || 100;

  const now = new Date();
  const data = [];
  
  // Generate data for the last 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some randomness to the price
    const randomChange = (Math.random() - 0.5) * 5;
    const value = basePrice + randomChange;
    
    data.push({
      time: formatDate(date),
      value: Number(value.toFixed(2)),
    });
  }
  
  return data;
};

function App() {
  const [symbol, setSymbol] = useState('AAPL');
  const [data, setData] = useState(generateMockData('AAPL'));
  const [stats, setStats] = useState({
    price: 180,
    change: 2.5,
    volume: 5000000,
    high: 185,
  });

  useEffect(() => {
    const newData = generateMockData(symbol);
    setData(newData);
    
    const interval = setInterval(() => {
      const lastValue = data[data.length - 1].value;
      const newValue = Number((lastValue + (Math.random() - 0.5) * 2).toFixed(2));
      const newTime = formatDate(new Date());
      
      setData(prev => {
        const updatedData = [...prev];
        if (updatedData[updatedData.length - 1].time === newTime) {
          updatedData[updatedData.length - 1].value = newValue;
        } else {
          updatedData.push({ time: newTime, value: newValue });
          if (updatedData.length > 31) {
            updatedData.shift();
          }
        }
        return updatedData;
      });

      setStats(prev => ({
        price: newValue,
        change: Number(((newValue - prev.price) / prev.price * 100).toFixed(2)),
        volume: Math.floor(prev.volume + Math.random() * 100000),
        high: Math.max(prev.high, newValue),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <header className="mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-bold mb-2 flex items-center gap-2"
          >
            <LineChart className="text-emerald-500" />
            Stock Market Dashboard
          </motion.h1>
          <p className="text-gray-400">Real-time stock market data visualization</p>
        </header>

        <StockSelector onSymbolChange={setSymbol} currentSymbol={symbol} />
        <StockStats {...stats} />
        <Chart data={data} symbol={symbol} />
      </motion.div>
    </div>
  );
}

export default App;