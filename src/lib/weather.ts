type DailyForecast = {
  Temperature: {
    Minimum: {
      Value: number;
    };
    Maximum: {
      Value: number;
    };
  };
  Day: {
    Icon: number;
    IconPhrase: string;
  };
  Night: {
    Icon: number;
    IconPhrase: string;
  };
};

type CurrentConditions = {
  WeatherText: string;
  WeatherIcon: number;
  RelativeHumidity: number;
  RealFeelTemperature: {
    Metric: {
      Value: number;
    };
  };
  Wind: {
    Speed: {
      Metric: {
        Value: number;
      };
    };
  };
};

// 添加城市信息类型
type CityInfo = {
  LocalizedName: string;  // 城市名称
  Country: {
    LocalizedName: string;  // 国家名称
  };
  Key: string;  // location key
};

// 添加重试函数
async function fetchWithRetry(url: string, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      if (response.status !== 503) throw new Error(`Failed with status: ${response.status}`);
      
      // 如果是503，等待后重试
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
  throw new Error('Max retries reached');
}

const API_ENDPOINTS = {
  citySearch: 'http://dataservice.accuweather.com/locations/v1/cities/search',
  currentConditions: 'http://dataservice.accuweather.com/currentconditions/v1',
  forecast: 'http://dataservice.accuweather.com/forecasts/v1/daily/1day'
};

// 使用测试数据
const MOCK_CITY_DATA: { [key: string]: CityInfo } = {
  'guangzhou': {
    LocalizedName: '广州',
    Country: { LocalizedName: '中国' },
    Key: '59287'
  },
  'shenzhen': {
    LocalizedName: '深圳',
    Country: { LocalizedName: '中国' },
    Key: '58194'
  },
  'beijing': {
    LocalizedName: '北京',
    Country: { LocalizedName: '中国' },
    Key: '101924'
  }
};

export async function getCityInfo(cityName: string): Promise<CityInfo | null> {
  // 开发环境使用模拟数据
  if (process.env.NODE_ENV === 'development') {
    const mockCity = MOCK_CITY_DATA[cityName.toLowerCase()];
    if (mockCity) {
      return mockCity;
    }
  }

  // 生产环境使用真实 API
  try {
    const response = await fetchWithRetry(
      `${API_ENDPOINTS.citySearch}?apikey=${process.env.NEXT_PUBLIC_ACCUWEATHER_API_KEY}&q=${cityName}&language=zh-cn`
    );
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching city info:', error);
    return null;
  }
}

export async function getWeatherData(locationKey: string) {
  try {
    // 获取实时天气
    const currentResponse = await fetch(
      `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${process.env.NEXT_PUBLIC_ACCUWEATHER_API_KEY}&details=true`
    );

    // 获取每日预报
    const forecastResponse = await fetch(
      `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${process.env.NEXT_PUBLIC_ACCUWEATHER_API_KEY}&metric=true`
    );

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Weather data fetch failed');
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    return {
      current: currentData[0] as CurrentConditions,
      forecast: forecastData.DailyForecasts[0] as DailyForecast
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
} 