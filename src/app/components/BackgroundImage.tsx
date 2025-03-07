'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const WEATHER_KEYWORDS = [
  'sunny landscape',
  'cloudy mountains',
  'rainy city',
  'storm landscape',
  'clear sky nature',
];

export default function BackgroundImage() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const keyword = WEATHER_KEYWORDS[Math.floor(Math.random() * WEATHER_KEYWORDS.length)];
        
        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=${keyword}&orientation=landscape`,
          {
            headers: {
              Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
            },
          }
        );
        
        const data = await response.json();
        setImageUrl(data.urls.regular);
      } catch (error) {
        console.error('Failed to fetch background image:', error);
      }
    };

    fetchBackgroundImage();
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {imageUrl && (
        <div className="relative w-full h-full">
          {/* 背景图片 */}
          <Image
            src={imageUrl}
            alt="Weather background"
            fill
            className={`
              object-cover
              transition-[filter] duration-1000
              ${isLoading ? 'blur-xl scale-110' : 'blur-0 scale-100'}
            `}
            onLoad={() => setIsLoading(false)}
            priority
            sizes="100vw"
            quality={90}
          />
          
          {/* 遮罩层 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      )}
    </div>
  );
} 