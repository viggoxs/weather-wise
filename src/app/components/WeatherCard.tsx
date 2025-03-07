'use client';

import { useEffect, useState } from 'react';
import { getWeatherData } from '@/lib/weather';

type WeatherDetailProps = {
  icon: string;
  label: string;
  value: string;
  bgColor: string;
};

function WeatherDetail({ icon, label, value, bgColor }: WeatherDetailProps) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center mb-2`}>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-2xl font-light mb-1 text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

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
        <div className="p-8">
          <div className="flex items-end gap-12">
            {/* 天气状态和温度 */}
            <div className="flex items-end gap-8">
              <div className="flex flex-col items-center">
                <div className="text-6xl mb-2">
                  {getWeatherEmoji(weather?.current?.WeatherIcon || 1)}
                </div>
                <div className="text-gray-500">{weather?.current?.WeatherText}</div>
              </div>
              <div>
                <div className="flex flex-col">
                  <div className="flex items-start gap-1">
                    <span className="text-4xl font-light text-gray-800">
                      {Math.round(weather?.forecast?.Temperature?.Maximum?.Value || 0)}
                    </span>
                    <span className="text-lg text-gray-800">°</span>
                    <span className="text-sm text-gray-500 mt-1">External</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <span className="text-4xl font-light text-gray-800">
                      {Math.round(weather?.forecast?.Temperature?.Minimum?.Value || 0)}
                    </span>
                    <span className="text-lg text-gray-800">°</span>
                    <span className="text-sm text-gray-500 mt-1">Internal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="h-16 w-px bg-gray-200" />

            {/* 详细信息 */}
            <div className="flex gap-16">
              <WeatherDetail 
                icon="💧" 
                label="Humidity (%)" 
                value={`${weather?.current?.RelativeHumidity || 0}`}
                bgColor="bg-blue-50"
              />
              <WeatherDetail 
                icon="🌡️" 
                label="Feels Like" 
                value={`${Math.round(weather?.current?.RealFeelTemperature?.Metric?.Value || 0)}°`}
                bgColor="bg-green-50"
              />
              <WeatherDetail 
                icon="💨" 
                label="Wind (km/h)" 
                value={`${Math.round(weather?.current?.Wind?.Speed?.Metric?.Value || 0)}`}
                bgColor="bg-yellow-50"
              />
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
    14: '��️', // 部分时间有雨
    15: '⛈️', // 雷雨
    16: '⛈️', // 雷阵雨
    17: '⛈️', // 雷暴
    18: '🌧️', // 雨
    19: '🌨️', // 雪
    // ... 可以根据需要添加更多天气代码
  };

  return weatherIcons[iconCode] || '☀️';
} 