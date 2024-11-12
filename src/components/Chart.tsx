import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import { motion } from 'framer-motion';

interface ChartProps {
  data: Array<{
    time: string;
    value: number;
  }>;
  symbol: string;
}

const Chart: React.FC<ChartProps> = ({ data, symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1E293B' },
        textColor: '#D1D5DB',
      },
      grid: {
        vertLines: { color: '#334155' },
        horzLines: { color: '#334155' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#334155',
      },
      rightPriceScale: {
        borderColor: '#334155',
      },
      crosshair: {
        vertLine: {
          color: '#475569',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: '#475569',
          width: 1,
          style: 3,
        },
      },
    });

    seriesRef.current = chartRef.current.addAreaSeries({
      lineColor: '#10B981',
      topColor: '#10B98150',
      bottomColor: '#10B98101',
      lineWidth: 2,
    });

    if (data && data.length > 0) {
      seriesRef.current.setData(data);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current && data && data.length > 0) {
      try {
        seriesRef.current.setData(data);
      } catch (error) {
        console.error('Error updating chart data:', error);
      }
    }
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800 rounded-lg p-4 shadow-xl"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-100">{symbol} Price Chart</h2>
      <div ref={chartContainerRef} className="w-full" />
    </motion.div>
  );
};

export default Chart;