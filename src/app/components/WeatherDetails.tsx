'use client';

import { Droplets, Thermometer, Wind, Umbrella } from 'lucide-react';

type WeatherDetailProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function WeatherDetail({ icon, label, value }: WeatherDetailProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mb-2 shadow-inner">
        {icon}
      </div>
      <div className="text-xl font-light mb-1 text-white">{value}</div>
      <div className="text-xs text-white/70">{label}</div>
    </div>
  );
}

type WeatherDetailsProps = {
  humidity: number;
  feelsLike: number;
  windSpeed: number;
  todayTemp?: number;
  yesterdayTemp?: number;
  weatherCode?: number;
};

export default function WeatherDetails({ 
  humidity, 
  feelsLike, 
  windSpeed,
  todayTemp,
  yesterdayTemp,
  weatherCode
}: WeatherDetailsProps) {
  // 计算今天和昨天的温度差异
  const getTempComparison = () => {
    if (!todayTemp || !yesterdayTemp) return null;
    
    const tempDiff = Math.round(todayTemp - yesterdayTemp);
    
    if (tempDiff > 0) {
      return {
        text: `Today is ${Math.abs(tempDiff)}° warmer than yesterday`,
        icon: '🔥',
        isCooler: false
      };
    } else if (tempDiff < 0) {
      return {
        text: `Today is ${Math.abs(tempDiff)}° cooler than yesterday`,
        icon: '❄️',
        isCooler: true
      };
    } else {
      return {
        text: "Today's temperature is the same as yesterday",
        icon: '⚖️',
        isCooler: false
      };
    }
  };
  
  const tempComparison = getTempComparison();
  
  // 处理文本，突出显示"cooler"
  const highlightCooler = (text: string) => {
    if (!tempComparison?.isCooler) return text;
    
    return text.replace('cooler', '<span class="text-white font-semibold">cooler</span>');
  };
  
  // 判断是否需要带伞
  const needUmbrella = () => {
    if (!weatherCode) return null;
    
    // 雨、雪、雷雨等天气代码，需要带伞
    const rainyWeatherCodes = [12, 13, 14, 15, 16, 17, 18, 19];
    
    if (rainyWeatherCodes.includes(weatherCode)) {
      return {
        text: "Don't forget your umbrella today",
        icon: <Umbrella size={16} className="text-blue-300 mr-1" />
      };
    } else {
      return {
        text: "No need for an umbrella today",
        icon: <Umbrella size={16} className="text-white/50 mr-1" />
      };
    }
  };
  
  const umbrella = needUmbrella();
  
  return (
    <div className="mb-8 max-w-4xl mx-auto">
      {/* 温度比较文案 - 大字体居中显示 */}
      {tempComparison && (
        <div className="text-center mb-6 flex flex-col items-center justify-center">
          <span className="text-4xl mb-2">{tempComparison.icon}</span>
          <span 
            className="text-3xl md:text-4xl font-medium text-white/80"
            dangerouslySetInnerHTML={{ __html: highlightCooler(tempComparison.text) }}
          />
          
          {/* 是否需要带伞的提示 */}
          {umbrella && (
            <div className="flex items-center mt-3 text-sm text-white/70">
              {umbrella.icon}
              <span>{umbrella.text}</span>
            </div>
          )}
        </div>
      )}
      
      {/* 三个值放在一行，变小 */}
      <div className="flex justify-center gap-12 md:gap-20">
        <WeatherDetail 
          icon={<Droplets className="text-blue-300" strokeWidth={1.5} size={24} />} 
          label="Humidity (%)" 
          value={`${humidity || 0}`}
        />
        <WeatherDetail 
          icon={<Thermometer className="text-red-300" strokeWidth={1.5} size={24} />} 
          label="Feels Like" 
          value={`${Math.round(feelsLike || 0)}°`}
        />
        <WeatherDetail 
          icon={<Wind className="text-green-300" strokeWidth={1.5} size={24} />} 
          label="Wind (km/h)" 
          value={`${Math.round(windSpeed || 0)}`}
        />
      </div>
    </div>
  );
} 