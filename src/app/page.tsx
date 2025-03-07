import { Suspense } from 'react';
import BackgroundImage from './components/BackgroundImage';

export default function Home() {
  return (
    <>
      <BackgroundImage />
      <main className="min-h-screen p-4 md:p-8">
        {/* 顶部导航栏 */}
        <nav className="weather-card mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-xl font-semibold">WeatherWise</span>
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>选择位置</span>
            </div>
          </div>
          <div className="relative">
            <input
              type="search"
              placeholder="搜索城市..."
              className="px-4 py-2 rounded-full bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 主要天气信息区域 */}
          <div className="lg:col-span-3">
            {/* 当前天气大卡片 */}
            <div className="weather-card mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-6xl font-bold">23°C</h1>
                  <p className="text-gray-600 mt-2">晴天</p>
                  <p className="text-sm text-gray-500 mt-1">比昨天温暖2°C</p>
                </div>
                <div className="text-8xl">☀️</div>
              </div>
            </div>

            {/* 7天预报卡片 */}
            <div className="weather-card overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4">7天预报</h2>
              <div className="flex gap-4 min-w-max">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center p-4 rounded-lg bg-white/50">
                    <span className="text-sm">{i === 0 ? '今天' : `周${['一', '二', '三', '四', '五', '六', '日'][(i + new Date().getDay() - 1) % 7]}`}</span>
                    <span className="text-2xl my-2">☀️</span>
                    <span className="text-sm">23°C</span>
                    <span className="text-xs text-gray-500">18°C</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 侧边详细信息 */}
          <div className="weather-card">
            <h2 className="text-xl font-semibold mb-4">详细信息</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>体感温度</span>
                <span>24°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span>湿度</span>
                <span>65%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>风速</span>
                <span>3.5 km/h</span>
              </div>
              <div className="flex justify-between items-center">
                <span>空气质量</span>
                <span>优</span>
              </div>
              <div className="flex justify-between items-center">
                <span>紫外线指数</span>
                <span>中等</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
