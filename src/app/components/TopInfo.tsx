'use client';
import { useState, useEffect } from 'react';
import CitySearch from './CitySearch';

type TopInfoProps = {
  city: string;
  country: string;
};

export default function TopInfo({ city, country }: TopInfoProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='p-8 flex justify-between items-start'>
      {/* 左侧日期时间信息 */}
      <div>
        <div className="text-2xl md:text-4xl font-medium mb-2 text-white">
          {currentTime.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <div className="text-sm md:text-lg text-white/70">
          {currentTime.toLocaleDateString('en-US', {
            weekday: 'short'
          })}
          {' · '}
          {currentTime.getFullYear()}
        </div>
      </div>

      {/* 右侧位置信息 */}
      <div className="flex items-center gap-4">
        <div>
          <div className="text-2xl font-light text-right text-white">{city}</div>
          <div className="text-white/70 text-right">{country}</div>
        </div>
        <CitySearch />
      </div>
    </div>
  );
} 