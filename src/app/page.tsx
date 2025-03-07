import { Suspense } from 'react';
import BackgroundImage from './components/BackgroundImage';
import WeatherCard from './components/WeatherCard';
import TopInfo from './components/TopInfo';

export default function Home() {
  return (
    <>
      <BackgroundImage />
      <main className="min-h-screen p-8 md:p-12">
        <TopInfo 
          time="7:10 AM"
          date="Friday, January 26, 2024"
          city="Beijing"
          country="China"
        />

        {/* 中间留白区域，用于展示背景图片 */}
        <div className="h-[40vh]" />

        {/* 底部天气信息卡片 */}
        <WeatherCard />
      </main>
    </>
  );
}
