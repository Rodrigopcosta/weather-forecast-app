"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calendar } from "lucide-react"
import { useTranslations, type Language } from "@/lib/translations"

interface ForecastData {
  list: {
    dt: number
    main: {
      temp: number
    }
    weather: {
      description: string
    }[]
  }[]
}

interface ForecastChartProps {
  lat: number
  lon: number
  language: Language
}

export function ForecastChart({ lat, lon, language }: ForecastChartProps) {
  const t = useTranslations(language)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await fetch(`/api/forecast?lat=${lat}&lon=${lon}`)
        if (response.ok) {
          const data = await response.json()
          setForecast(data)
        }
      } catch (error) {
        console.error("Erro ao buscar previsão:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchForecast()
  }, [lat, lon])

  if (loading) {
    return (
      <Card className="p-6 bg-card/80 backdrop-blur">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">{t.forecast5Days}</h3>
        </div>
        <div className="h-64 animate-pulse bg-muted/20 rounded-lg" />
      </Card>
    )
  }

  if (!forecast) return null

  const chartData = forecast.list
    .filter((_, index) => index % 8 === 0)
    .map((item) => ({
      date: new Date(item.dt * 1000).toLocaleDateString(
        language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en-US",
        { day: "2-digit", month: "short" },
      ),
      temperatura: Math.round(item.main.temp),
      description: item.weather[0].description,
    }))

  return (
    <Card className="p-6 bg-card/80 backdrop-blur animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold">{t.forecast5Days}</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#444" : "#ddd"} />
          <XAxis
            dataKey="date"
            style={{ fontSize: "12px" }}
            stroke={isDark ? "#888" : "#666"}
            tick={{ fill: isDark ? "#fff" : "#000" }}
          />
          <YAxis
            style={{ fontSize: "12px" }}
            stroke={isDark ? "#888" : "#666"}
            tick={{ fill: isDark ? "#fff" : "#000" }}
            unit="°"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f1f1f" : "#fff",
              border: `1px solid ${isDark ? "#444" : "#ddd"}`,
              borderRadius: "8px",
              color: isDark ? "#fff" : "#000",
            }}
            labelStyle={{ color: isDark ? "#fff" : "#000" }}
            formatter={(value: number) => [`${value}°C`, t.temperature || "Temperatura"]}
          />
          <Line
            type="monotone"
            dataKey="temperatura"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
