import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart } from 'lucide-react';
import Chart from './components/Chart';
import StockSelector from './components/StockSelector';
import StockStats from './components/StockStats';
import { generateSeries, nextTickValue, statsForSeries, type PricePoint } from './lib/market';

function App() {
  const [symbol, setSymbol] = useState('AAPL');
  const [data, setData] = useState<PricePoint[]>(() => generateSeries('AAPL'));
  const [stats, setStats] = useState(() => statsForSeries(generateSeries('AAPL')));

  // The live tick has to continue from the current last value of the series.
  // Keeping it in a ref avoids reading a stale `data` from the render in
  // which the effect was created.
  const lastValueRef = useRef<number>(data[data.length - 1].value);

  useEffect(() => {
    const newData = generateSeries(symbol);
    setData(newData);
    // Every card has to describe the selected symbol only.
    setStats(statsForSeries(newData));
    lastValueRef.current = newData[newData.length - 1].value;

    const interval = setInterval(() => {
      const newValue = nextTickValue(lastValueRef.current);
      lastValueRef.current = newValue;
      const newTime = new Date().toISOString().split('T')[0];

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
