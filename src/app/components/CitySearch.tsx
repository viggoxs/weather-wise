'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Command } from 'cmdk';
import { Search, X } from 'lucide-react';
import { Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';

type GeocodingResult = {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};

type SearchResult = {
  name: string;
  fullName: string;
  latitude: number;
  longitude: number;
};

export default function CitySearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 使用 useLayoutEffect 确保在 DOM 更新后立即聚焦
  useLayoutEffect(() => {
    if (isOpen && inputRef.current) {
      // 使用更长的延迟确保过渡动画完成后再聚焦
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(focusTimer);
    }
  }, [isOpen]);

  // 备用方法：使用普通的 useEffect 也尝试聚焦
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // 多次尝试聚焦，以应对可能的时机问题
      const attempts = [50, 150, 300, 500];
      const focusTimers = attempts.map(delay => 
        setTimeout(() => {
          inputRef.current?.focus();
        }, delay)
      );
      
      return () => focusTimers.forEach(timer => clearTimeout(timer));
    }
  }, [isOpen]);

  // Handle search
  useEffect(() => {
    const searchCity = async () => {
      if (!search.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // 预处理搜索词
        const searchTerms = [
          search, // 原始搜索词
          search.toLowerCase(), // 小写
          search.replace(/[^a-zA-Z\s]/g, ''), // 只保留字母和空格
          search.replace(/\s+/g, ''), // 移除所有空格
          search.replace(/\s+/g, ' ').trim(), // 标准化空格
          ...search.toLowerCase().split(/\s+/), // 单词拆分
          search.toLowerCase().replace(/\s+/g, '') // 小写且无空格
        ];

        // 使用 Set 去重
        const uniqueTerms = Array.from(new Set(searchTerms));
        
        // 并行请求所有搜索词
        const searchPromises = uniqueTerms.map(term => 
          fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(term)}&count=10&language=en&format=json`)
            .then(res => res.json())
        );

        const responses = await Promise.all(searchPromises);
        
        // 合并所有结果
        const allResults = responses
          .flatMap(data => data.results || [])
          .filter((city): city is GeocodingResult => Boolean(city));

        // 去重并排序结果
        const uniqueResults = Array.from(
          new Map(
            allResults.map(city => [
              `${city.latitude}-${city.longitude}`,
              {
                name: city.name,
                fullName: `${city.name}, ${city.country}${city.admin1 ? `, ${city.admin1}` : ''}`,
                latitude: city.latitude,
                longitude: city.longitude
              }
            ])
          ).values()
        );

        // 按相关性排序
        const sortedResults = uniqueResults.sort((a, b) => {
          const aScore = getSearchRelevanceScore(a.name, search);
          const bScore = getSearchRelevanceScore(b.name, search);
          return bScore - aScore;
        });

        setResults(sortedResults.slice(0, 5));
      } catch (error) {
        console.error('Error searching city:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchCity, 300);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  // 计算搜索相关性分数
  const getSearchRelevanceScore = (cityName: string, searchTerm: string): number => {
    const normalizedCity = cityName.toLowerCase().replace(/[^a-zA-Z\s]/g, '');
    const normalizedSearch = searchTerm.toLowerCase().replace(/[^a-zA-Z\s]/g, '');
    const noSpaceCity = normalizedCity.replace(/\s+/g, '');
    const noSpaceSearch = normalizedSearch.replace(/\s+/g, '');
    
    // 完全匹配（忽略大小写和特殊字符）
    if (normalizedCity === normalizedSearch) return 100;
    if (noSpaceCity === noSpaceSearch) return 95;
    
    // 部分匹配
    if (normalizedCity.startsWith(normalizedSearch)) return 90;
    if (noSpaceCity.startsWith(noSpaceSearch)) return 85;
    if (normalizedCity.includes(normalizedSearch)) return 80;
    if (noSpaceCity.includes(noSpaceSearch)) return 75;
    
    // 单词匹配
    const cityWords = normalizedCity.split(/\s+/);
    const searchWords = normalizedSearch.split(/\s+/);
    const matchingWords = searchWords.filter(searchWord => 
      cityWords.some(cityWord => 
        cityWord.includes(searchWord) || searchWord.includes(cityWord)
      )
    );
    
    return (matchingWords.length / searchWords.length) * 70;
  };

  // 处理键盘导航和选择
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 如果没有结果，不处理键盘导航
    if (results.length === 0) return;

    // 如果按下回车键且有选中的值，执行选择操作
    if (e.key === 'Enter' && selectedValue) {
      const selected = results.find(result => result.fullName === selectedValue);
      if (selected) {
        handleSelect(selected.fullName);
      }
    }
  };

  const handleSelect = (value: string) => {
    const selected = results.find(result => result.fullName === value);
    if (selected) {
      // 将城市名转换为小写并替换空格为连字符，确保 URL 友好
      const urlFriendlyName = selected.name.toLowerCase().replace(/\s+/g, '-');
      router.push(`/${urlFriendlyName}`);
      setIsOpen(false);
      setSearch('');
      setSelectedValue('');
    }
  };

  // 手动聚焦方法
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative">
      {/* Search button */}
      <button
        onClick={() => {
          setIsOpen(true);
          // 点击按钮后也尝试聚焦
          setTimeout(focusInput, 100);
        }}
        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center
                   hover:bg-white/20 transition-all duration-200 text-white"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search dialog */}
      <Transition
        show={isOpen}
        enter="transition duration-200 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-150 ease-in"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
        afterEnter={focusInput}
      >
        <div className="absolute top-0 right-0 w-80 bg-white rounded-lg shadow-xl overflow-hidden">
          <Command 
            className="border-none" 
            shouldFilter={false} 
            ref={commandRef} 
            loop
            value={selectedValue}
            onValueChange={setSelectedValue}
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center border-b border-gray-100 p-2">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <Command.Input
                ref={inputRef}
                value={search}
                onValueChange={setSearch}
                placeholder="Search cities..."
                className="w-full border-none outline-none placeholder:text-gray-400"
                autoFocus
              />
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSearch('');
                  setSelectedValue('');
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <Command.List className="p-2 max-h-64 overflow-y-auto">
              {loading && (
                <Command.Loading>
                  <div className="py-2 px-3 text-sm text-gray-500">Searching...</div>
                </Command.Loading>
              )}
              
              {!loading && results.length === 0 && search && (
                <Command.Empty>
                  <div className="py-2 px-3 text-sm text-gray-500">No cities found</div>
                </Command.Empty>
              )}

              <Command.Group>
                {results.map((result) => (
                  <Command.Item
                    key={`${result.latitude}-${result.longitude}`}
                    value={result.fullName}
                    onSelect={handleSelect}
                    className={`py-2 px-3 rounded cursor-pointer text-sm hover:bg-gray-100 ${
                      selectedValue === result.fullName ? 'bg-gray-100' : ''
                    }`}
                  >
                    {result.fullName}
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      </Transition>
    </div>
  );
}