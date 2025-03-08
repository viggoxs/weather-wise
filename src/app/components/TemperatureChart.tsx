'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Chart
} from 'chart.js';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type TemperatureChartProps = {
  dailyForecasts: Array<{
    date: string;
    weekday: string;
    dayType: string;
    temperature: {
      maximum: number;
      minimum: number;
    };
  }>;
};

export default function TemperatureChart({ dailyForecasts }: TemperatureChartProps) {
  // 确保数据按日期排序
  const sortedForecasts = [...dailyForecasts].sort((a, b) => {
    // 确保昨天在最左边，今天在第二位，其他按日期排序
    if (a.dayType === 'yesterday') return -1;
    if (b.dayType === 'yesterday') return 1;
    if (a.dayType === 'today') return -1;
    if (b.dayType === 'today') return 1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }).slice(0, 7); // 只显示7天的数据

  const labels = sortedForecasts.map(day => 
    day.dayType === 'yesterday' ? 'Yesterday' : 
    day.dayType === 'today' ? 'Today' : day.weekday
  );

  const maxTemperatures = sortedForecasts.map(day => day.temperature.maximum);
  
  // 找到今天的索引
  const todayIndex = sortedForecasts.findIndex(day => day.dayType === 'today');
  
  // 创建点的样式数组，今天的点会有不同的样式
  const pointBackgroundColors = sortedForecasts.map(day => 
    day.dayType === 'today' ? '#FFFFFF' : 'rgba(255, 255, 255)'
  );
  
  
  const pointRadiuses = sortedForecasts.map(day => 
    day.dayType === 'today' ? 6 : 4
  );

  const data = {
    labels,
    datasets: [
      {
        label: '最高温度 (°C)',
        data: maxTemperatures,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        tension: 0.3, // 使曲线更平滑
        pointRadius: pointRadiuses,
        pointBackgroundColor: pointBackgroundColors,
        pointBorderWidth: 0, // 去掉圆点描边
        // 确保点在中间
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      }
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 30,  // 左侧添加内边距
        right: 30, // 右侧添加内边距
        top: 30,   // 顶部添加内边距，为Today文字留出空间
      }
    },
    scales: {
      y: {
        display: false, // 隐藏Y轴
        suggestedMin: Math.min(...maxTemperatures) - 2,
        suggestedMax: Math.max(...maxTemperatures) + 2,
      },
      x: {
        display: false, // 隐藏X轴
        offset: true,   // 启用偏移，使点居中
        grid: {
          offset: true  // 确保网格线与点对齐
        }
      }
    },
    plugins: {
      legend: {
        display: false, // 隐藏图例
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y}°C`;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
      }
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        hitRadius: 10, // 增加点的可点击区域
      }
    },
  };

  // 自定义插件，用于在今天的圆点上方显示"Today"文字
  const todayLabelPlugin = {
    id: 'todayLabel',
    afterDraw: (chart: Chart) => {
      if (todayIndex !== -1) {
        const ctx = chart.ctx;
        const meta = chart.getDatasetMeta(0);
        const point = meta.data[todayIndex];
        
        if (point) {
          const x = point.x;
          const y = point.y - 20; // 在点上方20像素处显示文字
          
          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = '14px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillText('Today', x, y);
          ctx.restore();
        }
      }
    }
  };

  return (
    <div className="w-full h-28 mt-1 mb-2">
      <Line 
        options={options} 
        data={data} 
        plugins={[todayLabelPlugin]}
      />
    </div>
  );
} 