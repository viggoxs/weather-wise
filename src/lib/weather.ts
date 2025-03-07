const SHENZHEN_LOCATION_KEY = '58194'; // 深圳的 location key

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

export async function getWeatherData() {
  try {
    // 获取实时天气
    const currentResponse = await fetch(
      `http://dataservice.accuweather.com/currentconditions/v1/${SHENZHEN_LOCATION_KEY}?apikey=${process.env.NEXT_PUBLIC_ACCUWEATHER_API_KEY}&details=true`
    );

    // 获取每日预报
    const forecastResponse = await fetch(
      `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${SHENZHEN_LOCATION_KEY}?apikey=${process.env.NEXT_PUBLIC_ACCUWEATHER_API_KEY}&metric=true`
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