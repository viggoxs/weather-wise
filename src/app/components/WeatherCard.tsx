type WeatherDetailProps = {
  icon: string;
  label: string;
  value: string;
  bgColor: string;
};

function WeatherDetail({ icon, label, value, bgColor }: WeatherDetailProps) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center mb-2`}>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-2xl font-light mb-1 text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

export default function WeatherCard() {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-white shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="p-8">
          <div className="flex items-end gap-12">
            {/* 天气状态和温度 */}
            <div className="flex items-end gap-8">
              <div className="text-6xl">☁️</div>
              <div>
                <div className="flex items-start">
                  <span className="text-6xl font-light text-gray-800">26</span>
                  <span className="text-2xl text-gray-800">°</span>
                </div>
                <div className="text-gray-500">Mostly Cloudy</div>
              </div>
            </div>

            {/* 分隔线 */}
            <div className="h-16 w-px bg-gray-200" />

            {/* 详细信息 */}
            <div className="flex gap-16">
              <WeatherDetail 
                icon="💧" 
                label="Humidity (%)" 
                value="20" 
                bgColor="bg-blue-50"
              />
              <WeatherDetail 
                icon="🌡️" 
                label="CO₂ Levels (ppm)" 
                value="486" 
                bgColor="bg-green-50"
              />
              <WeatherDetail 
                icon="🏠" 
                label="TVOC Levels (ppb)" 
                value="935" 
                bgColor="bg-yellow-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 