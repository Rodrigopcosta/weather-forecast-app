"use client"

import { Card } from "@/components/ui/card"
import { Cloud, Droplets, Wind, Eye, Gauge, Thermometer, CloudRain } from "lucide-react"
import type { WeatherData } from "./weather-search"
import { ForecastChart } from "./forecast-chart"
import { useTranslations, type Language } from "@/lib/translations"
import { UVIndexDisplay } from "./uv-index-display"

interface WeatherDisplayProps {
  weather: WeatherData
  language: Language
}

export function WeatherDisplay({ weather, language }: WeatherDisplayProps) {
  const t = useTranslations(language)

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`
  }

  const formatTemp = (temp: number) => Math.round(temp)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Card Principal */}
      <Card className="p-8 bg-card/80 backdrop-blur border-2 hover:border-primary/50 transition-colors">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={getWeatherIcon(weather.weather[0].icon) || "/placeholder.svg"}
              alt={weather.weather[0].description}
              className="w-32 h-32 animate-in zoom-in duration-500"
            />
            <div>
              <h2 className="text-4xl font-bold mb-1">
                {weather.name}, {weather.sys.country}
              </h2>
              <p className="text-xl text-muted-foreground capitalize">{weather.weather[0].description}</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <div className="text-7xl font-bold text-primary animate-in zoom-in duration-700">
              {formatTemp(weather.main.temp)}°
            </div>
            <p className="text-lg text-muted-foreground mt-2">
              {t.feelsLike}: {formatTemp(weather.main.feels_like)}°
            </p>
          </div>
        </div>
      </Card>

      <ForecastChart lat={weather.coord.lat} lon={weather.coord.lon} language={language} />

      <UVIndexDisplay lat={weather.coord.lat} lon={weather.coord.lon} language={language} />

      {/* Detalhes do Clima */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-card/80 backdrop-blur hover:bg-card/90 transition-all hover:scale-105 duration-200">
          <div className="flex items-center gap-3 mb-2">
            <Thermometer className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">{t.minMax}</span>
          </div>
          <div className="text-2xl font-semibold">
            {formatTemp(weather.main.temp_min)}° / {formatTemp(weather.main.temp_max)}°
          </div>
        </Card>

        <Card className="p-6 bg-card/80 backdrop-blur hover:bg-card/90 transition-all hover:scale-105 duration-200">
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">{t.humidity}</span>
          </div>
          <div className="text-2xl font-semibold">{weather.main.humidity}%</div>
        </Card>

        <Card className="p-6 bg-card/80 backdrop-blur hover:bg-card/90 transition-all hover:scale-105 duration-200">
          <div className="flex items-center gap-3 mb-2">
            <Wind className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">{t.wind}</span>
          </div>
          <div className="text-2xl font-semibold">{Math.round(weather.wind.speed * 3.6)} km/h</div>
        </Card>

        <Card className="p-6 bg-card/80 backdrop-blur hover:bg-card/90 transition-all hover:scale-105 duration-200">
          <div className="flex items-center gap-3 mb-2">
            <Gauge className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">{t.pressure}</span>
          </div>
          <div className="text-2xl font-semibold">{weather.main.pressure} hPa</div>
        </Card>

        <Card className="p-6 bg-card/80 backdrop-blur hover:bg-card/90 transition-all hover:scale-105 duration-200">
          <div className="flex items-center gap-3 mb-2">
            <Cloud className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">{t.clouds}</span>
          </div>
          <div className="text-2xl font-semibold">{weather.clouds.all}%</div>
        </Card>

        <Card className="p-6 bg-card/80 backdrop-blur hover:bg-card/90 transition-all hover:scale-105 duration-200">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">{t.visibility}</span>
          </div>
          <div className="text-2xl font-semibold">
            {weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : t.noData}
          </div>
        </Card>

        {weather.rain && (
          <Card className="p-6 bg-card/80 backdrop-blur hover:bg-card/90 transition-all hover:scale-105 duration-200">
            <div className="flex items-center gap-3 mb-2">
              <CloudRain className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">{t.precipitation}</span>
            </div>
            <div className="text-2xl font-semibold">{weather.rain["1h"] || weather.rain["3h"] || 0} mm</div>
          </Card>
        )}
      </div>
    </div>
  )
}
