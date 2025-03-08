'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// 天气状况对应的图片URL（从 Unsplash 精选）
const WEATHER_IMAGES: { [key: number]: string[] } = {
  0: [ // 晴天
    'https://images.unsplash.com/photo-1566155119454-2b581dd44c59',
    'https://images.unsplash.com/photo-1541417904950-b855846fe074',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
  ],
  1: [ // 多云转晴
    'https://images.unsplash.com/photo-1594156596782-656c93e4d504',
    'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31',
    'https://images.unsplash.com/photo-1534088568595-a066f410bcda'
  ],
  2: [ // 多云
    'https://images.unsplash.com/photo-1534088568595-a066f410bcda',
    'https://images.unsplash.com/photo-1505533542167-8c89838bb019',
    'https://images.unsplash.com/photo-1594156596782-656c93e4d504'
  ],
  3: [ // 阴天
    'https://images.unsplash.com/photo-1499956827185-0d63ee78a910',
    'https://images.unsplash.com/photo-1525087740718-9e0f2c58c7ef',
    'https://images.unsplash.com/photo-1428592953211-077101b2021b'
  ],
  45: [ // 雾
    'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227',
    'https://images.unsplash.com/photo-1487621167305-5d248087c724',
    'https://images.unsplash.com/photo-1482841628122-9080d44bb807'
  ],
  48: [ // 霜雾
    'https://images.unsplash.com/photo-1476900543704-4312b78632f8',
    'https://images.unsplash.com/photo-1457269449834-928af64c684d',
    'https://images.unsplash.com/photo-1510596713412-56030de252c8'
  ],
  51: [ // 小雨
    'https://images.unsplash.com/photo-1438449805896-28a666819a20',
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0',
    'https://images.unsplash.com/photo-1501691223387-dd0500403074'
  ],
  53: [ // 中雨
    'https://images.unsplash.com/photo-1428592953211-077101b2021b',
    'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17',
    'https://images.unsplash.com/photo-1519692933481-e162a57d6721'
  ],
  55: [ // 大雨
    'https://images.unsplash.com/photo-1503435824048-a799a3a84bf7',
    'https://images.unsplash.com/photo-1525087740718-9e0f2c58c7ef',
    'https://images.unsplash.com/photo-1493314894560-5c412a56c17c'
  ],
  71: [ // 小雪
    'https://images.unsplash.com/photo-1491002052546-bf38f186af56',
    'https://images.unsplash.com/photo-1520454974749-611b7248ffdb',
    'https://images.unsplash.com/photo-1483664852095-d6cc6870702d'
  ],
  73: [ // 中雪
    'https://images.unsplash.com/photo-1516431883659-655d41c09bf9',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
    'https://images.unsplash.com/photo-1418985991508-e47386d96a71'
  ],
  75: [ // 大雪
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
    'https://images.unsplash.com/photo-1520454974749-611b7248ffdb',
    'https://images.unsplash.com/photo-1516431883659-655d41c09bf9'
  ],
  95: [ // 雷暴
    'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28',
    'https://images.unsplash.com/photo-1429552077091-836152271555',
    'https://images.unsplash.com/photo-1537210249814-b9a10a161ae4'
  ]
};

type BackgroundImageProps = {
  weatherCode?: number;
};

export default function BackgroundImage({ weatherCode = 0 }: BackgroundImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // 获取当前天气对应的图片URL
    const images = WEATHER_IMAGES[weatherCode] || WEATHER_IMAGES[0];
    // 使用固定索引而不是随机，确保服务器和客户端渲染一致
    const selectedImage = images[0];
    // 添加图片优化参数
    setImageUrl(`${selectedImage}?auto=format&fit=crop&w=1920&q=80`);
  }, [weatherCode]);

  return (
    <div className="fixed inset-0 -z-10">
      <div className="relative w-full h-full">
        {imageUrl && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
} 