import { getCityInfo, getWeatherData } from '@/lib/weather';
import BackgroundImage from '../components/BackgroundImage';
import WeatherCard from '../components/WeatherCard';
import WeatherDetails from '../components/WeatherDetails';
import TopInfo from '../components/TopInfo';

export default async function CityPage({ params }: { params: { city: string } }) {
  const cityInfo = await getCityInfo(params.city);

  if (!cityInfo) {
    // 如果找不到城市信息，可以重定向到默认城市或显示错误页面
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">城市未找到</div>
      </div>
    );
  }

  const weatherData = await getWeatherData(cityInfo.Key);
  const weatherCode = weatherData?.current?.WeatherIcon || 0;
  
  // 获取今天和昨天的温度数据
  const todayForecast = weatherData?.dailyForecasts?.find(day => day.dayType === 'today');
  const yesterdayForecast = weatherData?.dailyForecasts?.find(day => day.dayType === 'yesterday');
  
  const todayTemp = todayForecast?.temperature?.maximum;
  const yesterdayTemp = yesterdayForecast?.temperature?.maximum;

  return (
    <>
      <BackgroundImage weatherCode={weatherCode} />
      {/* 添加半透明暗色叠加层，使白色文字更加清晰 */}
      <div className="fixed inset-0 bg-black/30 pointer-events-none" />
      
      <main className="h-screen relative z-10 flex flex-col justify-between overflow-hidden">
        {/* 顶部区域 */}
        <div>
          <TopInfo 
            city={cityInfo.LocalizedName}
            country={cityInfo.Country.LocalizedName}
          />
        </div>
        
        {/* 中间区域 - 天气详情组件居中显示 */}
        <div className="flex-grow flex justify-center items-center">
          <WeatherDetails 
            precipitationProbability={todayForecast?.precipitationProbability || 0}
            sunrise={todayForecast?.sunrise || ''}
            sunset={todayForecast?.sunset || ''}
            todayTemp={todayTemp}
            yesterdayTemp={yesterdayTemp}
            weatherCode={todayForecast?.weatherCode}
            dailyForecasts={weatherData?.dailyForecasts}
          />
        </div>
        
        {/* 底部区域 */}
          <WeatherCard locationKey={cityInfo.Key} />
      </main>
    </>
  );
} 