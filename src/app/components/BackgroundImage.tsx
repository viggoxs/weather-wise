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
          `https://api.unsplash.com/photos/random?query=${keyword}&orientation=landscape&content_filter=high`,
          {
            headers: {
              Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
            },
          }
        );
        
        const data = await response.json();
        setImageUrl(data.urls.full || data.urls.raw || data.urls.regular);
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
        {/* 背景图片 */}
        <Image
          src={imageUrl}
          alt="Weather background"
          fill
          quality={100}
          className={`object-cover transition-opacity duration-1000 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          priority
        />
        
        {/* 更柔和的遮罩效果 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </>
  );
} 