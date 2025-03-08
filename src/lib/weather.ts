// Types for Open-Meteo API responses
type GeocodingResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State/Province
  timezone: string;
};

type WeatherData = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
};

// Weather codes mapping
const WEATHER_CODES: { [key: number]: { text: string; icon: string } } = {
  0: { text: 'Clear sky', icon: '☀️' },
  1: { text: 'Mainly clear', icon: '🌤️' },
  2: { text: 'Partly cloudy', icon: '⛅' },
  3: { text: 'Overcast', icon: '☁️' },
  45: { text: 'Foggy', icon: '🌫️' },
  48: { text: 'Depositing rime fog', icon: '🌫️' },
  51: { text: 'Light drizzle', icon: '🌧️' },
  53: { text: 'Moderate drizzle', icon: '🌧️' },
  55: { text: 'Dense drizzle', icon: '🌧️' },
  61: { text: 'Slight rain', icon: '🌧️' },
  63: { text: 'Moderate rain', icon: '🌧️' },
  65: { text: 'Heavy rain', icon: '🌧️' },
  71: { text: 'Slight snow fall', icon: '🌨️' },
  73: { text: 'Moderate snow fall', icon: '🌨️' },
  75: { text: 'Heavy snow fall', icon: '🌨️' },
  77: { text: 'Snow grains', icon: '🌨️' },
  80: { text: 'Slight rain showers', icon: '🌦️' },
  81: { text: 'Moderate rain showers', icon: '🌦️' },
  82: { text: 'Violent rain showers', icon: '🌦️' },
  85: { text: 'Slight snow showers', icon: '🌨️' },
  86: { text: 'Heavy snow showers', icon: '🌨️' },
  95: { text: 'Thunderstorm', icon: '⛈️' },
  96: { text: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { text: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

export async function getCityInfo(cityName: string): Promise<{
  LocalizedName: string;
  Country: { LocalizedName: string };
  Key: string;
  latitude: number;
  longitude: number;
} | null> {
  try {
    // 处理 URL 友好的城市名（将连字符替换为空格）
    const searchName = cityName.replace(/-/g, ' ');
    
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchName)}&count=1&language=en&format=json`
    );
    const data = await response.json();
    
    if (!data.results?.[0]) {
      // 如果找不到结果，尝试原始名称
      if (searchName !== cityName) {
        const originalResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
        );
        const originalData = await originalResponse.json();
        if (originalData.results?.[0]) {
          const result = originalData.results[0] as GeocodingResult;
          return {
            LocalizedName: result.name,
            Country: { LocalizedName: result.country },
            Key: result.id.toString(),
            latitude: result.latitude,
            longitude: result.longitude
          };
        }
      }
      return null;
    }

    const result = data.results[0] as GeocodingResult;
    return {
      LocalizedName: result.name,
      Country: { LocalizedName: result.country },
      Key: result.id.toString(),
      latitude: result.latitude,
      longitude: result.longitude
    };
  } catch (error) {
    console.error('Error fetching city info:', error);
    return null;
  }
}

export async function getWeatherData(locationKey: string) {
  try {
    // First get the coordinates from the location key
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/get?id=${locationKey}`
    );
    const locationData = await response.json() as GeocodingResult;

    // 获取昨天的日期
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // 获取今天的日期
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Then get the weather data using the coordinates
    // 添加past_days=1参数获取昨天的数据，forecast_days=6获取今天和未来5天的数据
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${locationData.latitude}&longitude=${locationData.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=${locationData.timezone}&forecast_days=6&past_days=1`
    );
    const weatherData = await weatherResponse.json() as WeatherData;

    const currentWeatherCode = weatherData.current.weather_code;
    const weatherInfo = WEATHER_CODES[currentWeatherCode] || { text: 'Unknown', icon: '❓' };

    // 获取星期几的名称
    const weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
    const dailyForecasts = weatherData.daily.time.map((time, index) => {
      const date = new Date(time);
      const weekday = weekdays[date.getDay()];
      
      // 标记是否为昨天或今天
      let dayType = '';
      if (time === yesterdayStr) {
        dayType = 'yesterday';
      } else if (time === todayStr) {
        dayType = 'today';
      }
      
      return {
        date: time,
        weekday,
        dayType,
        temperature: {
          maximum: weatherData.daily.temperature_2m_max[index],
          minimum: weatherData.daily.temperature_2m_min[index]
        },
        weatherCode: weatherData.daily.weather_code[index],
        weatherText: WEATHER_CODES[weatherData.daily.weather_code[index]]?.text || 'Unknown'
      };
    });

    return {
      current: {
        WeatherText: weatherInfo.text,
        WeatherIcon: currentWeatherCode,
        RelativeHumidity: weatherData.current.relative_humidity_2m,
        RealFeelTemperature: {
          Metric: {
            Value: weatherData.current.apparent_temperature
          }
        },
        Wind: {
          Speed: {
            Metric: {
              Value: weatherData.current.wind_speed_10m
            }
          }
        }
      },
      forecast: {
        Temperature: {
          Maximum: {
            Value: weatherData.daily.temperature_2m_max[weatherData.daily.time.findIndex(t => t === todayStr)]
          },
          Minimum: {
            Value: weatherData.daily.temperature_2m_min[weatherData.daily.time.findIndex(t => t === todayStr)]
          }
        },
        Day: {
          Icon: weatherData.daily.weather_code[weatherData.daily.time.findIndex(t => t === todayStr)],
          IconPhrase: WEATHER_CODES[weatherData.daily.weather_code[weatherData.daily.time.findIndex(t => t === todayStr)]]?.text || 'Unknown'
        },
        Night: {
          Icon: weatherData.daily.weather_code[weatherData.daily.time.findIndex(t => t === todayStr)],
          IconPhrase: WEATHER_CODES[weatherData.daily.weather_code[weatherData.daily.time.findIndex(t => t === todayStr)]]?.text || 'Unknown'
        }
      },
      dailyForecasts
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
} 