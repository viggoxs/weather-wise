import { getCityInfo, getWeatherData } from '@/lib/weather';
import BackgroundImage from '../components/BackgroundImage';
import WeatherCard from '../components/WeatherCard';
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

  return (
    <>
      <BackgroundImage weatherCode={weatherCode} />
      <main className="min-h-screen p-8 md:p-12">
        <TopInfo 
          city={cityInfo.LocalizedName}
          country={cityInfo.Country.LocalizedName}
        />
        <div className="h-[40vh]" />
        <WeatherCard locationKey={cityInfo.Key} />
      </main>
    </>
  );
} 