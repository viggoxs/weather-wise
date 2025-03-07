import { Suspense } from 'react';
import BackgroundImage from './components/BackgroundImage';
import WeatherCard from './components/WeatherCard';

export default function Home() {
  return (
    <>
      <BackgroundImage />
      <main className="min-h-screen p-8 md:p-12">
        {/* 顶部时间和位置信息 */}
        <div className="mb-20">
          <div className="text-4xl font-light mb-2">7:10 AM</div>
          <div className="text-lg text-gray-200">Friday, January 26, 2024</div>
          <div className="absolute top-8 right-12">
            <div className="text-2xl font-light text-right text-white">Beijing</div>
            <div className="text-gray-200">China</div>
          </div>
        </div>

        {/* 中间留白区域，用于展示背景图片 */}
        <div className="h-[40vh]" />

        {/* 底部天气信息卡片 */}
        <WeatherCard />
      </main>
    </>
  );
}
