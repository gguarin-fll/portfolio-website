'use client';

import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Statistic } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartComponentProps {
  statistic: Statistic;
  height?: number;
}

export default function ChartComponent({ statistic, height = 300 }: ChartComponentProps) {
  const chartRef = useRef<ChartJS>(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      }
    },
    scales: statistic.chartType === 'radar' || statistic.chartType === 'pie' || statistic.chartType === 'doughnut' 
      ? {} 
      : {
          x: {
            grid: {
              color: 'rgba(156, 163, 175, 0.1)'
            },
            ticks: {
              color: 'rgb(156, 163, 175)'
            }
          },
          y: {
            grid: {
              color: 'rgba(156, 163, 175, 0.1)'
            },
            ticks: {
              color: 'rgb(156, 163, 175)'
            }
          }
        }
  };

  return (
    <div style={{ height }}>
      <Chart
        ref={chartRef}
        type={statistic.chartType === 'area' ? 'line' : statistic.chartType}
        data={statistic.data}
        options={options}
      />
    </div>
  );
}