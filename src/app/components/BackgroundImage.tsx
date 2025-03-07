'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const WEATHER_KEYWORDS = [
  'sunny weather',
  'cloudy sky',
  'rainy weather',
  'storm clouds',
  'clear sky',
];

export default function BackgroundImage() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        // 随机选择一个天气关键词
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackgroundImage();
  }, []);

  if (!imageUrl) return null;

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black/30 z-10" /> {/* 暗色遮罩，确保文字可见 */}
        <Image
          src={imageUrl}
          alt="Weather background"
          fill
          className={`object-cover transition-opacity duration-1000 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          priority
        />
      </div>
    </>
  );
} 