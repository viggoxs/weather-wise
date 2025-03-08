'use client';

import { useEffect, useState } from 'react';
import { getWeatherData } from '@/lib/weather';

type WeatherData = {
  current: {
    WeatherText: string;
    WeatherIcon: number;
    RelativeHumidity: number;
    RealFeelTemperature: {
      Metric: { Value: number }
    };
    Wind: {
      Speed: { Metric: { Value: number } }
    };
  };
  forecast: {
    Temperature: {
      Maximum: { Value: number };
      Minimum: { Value: number };
    };
  };
  dailyForecasts: Array<{
    date: string;
    weekday: string;
    dayType: string; // 'yesterday', 'today', or ''
    temperature: {
      maximum: number;
      minimum: number;
    };
    weatherCode: number;
    weatherText: string;
  }>;
};

export default function WeatherCard({ locationKey }: { locationKey: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      const data = await getWeatherData(locationKey);
      setWeather(data);
      setLoading(false);
    }

    fetchWeather();
    // 每30分钟更新一次天气数据
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [locationKey]);

  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 w-full bg-white shadow-lg backdrop-blur-sm">
        <div className="max-w-7xl mx-auto p-8">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-white shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
            {/* 左侧：今天天气状态和温度 */}
            <div className="flex items-end gap-8">
              <div className="flex flex-col items-center">
                <div className="text-5xl md:text-6xl mb-2">
                  {getWeatherEmoji(weather?.current?.WeatherIcon || 1)}
                </div>
                <div className="text-gray-500">{weather?.current?.WeatherText}</div>
              </div>
              <div>
                <div className="flex flex-col">
                  <div className="flex items-start gap-1">
                    <span className="text-3xl md:text-4xl font-light text-gray-800">
                      {Math.round(weather?.forecast?.Temperature?.Maximum?.Value || 0)}
                    </span>
                    <span className="text-lg text-gray-800">°</span>
                    <span className="text-sm text-gray-500 mt-1">External</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <span className="text-3xl md:text-4xl font-light text-gray-800">
                      {Math.round(weather?.forecast?.Temperature?.Minimum?.Value || 0)}
                    </span>
                    <span className="text-lg text-gray-800">°</span>
                    <span className="text-sm text-gray-500 mt-1">Internal</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 分隔线 - 仅在桌面显示 */}
            <div className="hidden md:block h-16 w-px bg-gray-200 mx-4"></div>
            
            {/* 右侧：昨天、今天和未来几天的天气预报 */}
            <div className="flex justify-between gap-3 md:gap-5 w-full md:w-auto overflow-x-auto pb-2">
              {weather?.dailyForecasts
                ?.filter(day => day.dayType === 'yesterday' || day.dayType === 'today' || !day.dayType)
                ?.sort((a, b) => {
                  // 确保昨天在最左边，今天在第二位，其他按日期排序
                  if (a.dayType === 'yesterday') return -1;
                  if (b.dayType === 'yesterday') return 1;
                  if (a.dayType === 'today') return -1;
                  if (b.dayType === 'today') return 1;
                  return new Date(a.date).getTime() - new Date(b.date).getTime();
                })
                ?.slice(0, 7)
                ?.map((day, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col items-center px-2 py-1 rounded-lg min-w-[60px] md:min-w-[70px] ${
                    day.dayType === 'today' ? 'bg-blue-50 border border-blue-100' : 
                    day.dayType === 'yesterday' ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className={`text-sm md:text-base font-medium mb-1 ${
                    day.dayType === 'today' ? 'text-blue-600' : 
                    day.dayType === 'yesterday' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {day.dayType === 'yesterday' ? 'Yesterday' : 
                     day.dayType === 'today' ? 'Today' : day.weekday}
                  </div>
                  <div className="text-xl md:text-2xl mb-1">
                    {getWeatherEmoji(day.weatherCode)}
                  </div>
                  <div className={`text-base md:text-lg font-light ${
                    day.dayType === 'today' ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {Math.round(day.temperature.maximum)}°
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 根据天气图标代码返回对应的emoji
function getWeatherEmoji(iconCode: number): string {
  const weatherIcons: { [key: number]: string } = {
    1: '☀️',  // 晴天
    2: '🌤️',  // 大部晴朗
    3: '⛅',  // 多云
    4: '☁️',  // 阴天
    5: '🌫️',  // 霾
    6: '☁️',  // 多云
    7: '☁️',  // 阴天
    8: '⛅',  // 多云
    11: '🌫️', // 雾
    12: '🌧️', // 雨
    13: '🌦️', // 零星阵雨
    14: '🌧️', // 部分时间有雨
    15: '⛈️', // 雷雨
    16: '⛈️', // 雷阵雨
    17: '⛈️', // 雷暴
    18: '🌧️', // 雨
    19: '🌨️', // 雪
    // ... 可以根据需要添加更多天气代码
  };

  return weatherIcons[iconCode] || '☀️';
} 