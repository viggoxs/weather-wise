'use client';
import { useState, useEffect } from 'react';

export type TopInfoProps = {
  time: string;
  date: string;
  city: string;
  country: string;
};

export default function TopInfo({ city, country }: Omit<TopInfoProps, 'time' | 'date'>) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-20">
      {/* 左侧时间日期 */}
      <div>
        <div className="text-4xl font-light mb-2 text-white">
          {currentTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </div>
        <div className="text-lg text-white/70">
          {currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* 右侧位置信息 */}
      <div className="absolute top-8 right-12">
        <div className="text-2xl font-light text-right text-white">{city}</div>
        <div className="text-white/70">{country}</div>
      </div>
    </div>
  );
} 