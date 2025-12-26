"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Sun, AlertTriangle } from "lucide-react"
import { useTranslations, type Language } from "@/lib/translations"

interface UVIndexProps {
  lat: number
  lon: number
  language: Language
}

export function UVIndexDisplay({ lat, lon, language }: UVIndexProps) {
  const t = useTranslations(language)
  const [uvIndex, setUvIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUVIndex = async () => {
      try {
        const response = await fetch(`/api/uv?lat=${lat}&lon=${lon}`)
        if (response.ok) {
          const data = await response.json()
          setUvIndex(data.value)
        }
      } catch (error) {
        console.error("Erro ao buscar índice UV:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUVIndex()
  }, [lat, lon])

  if (loading) {
    return (
      <Card className="p-6 bg-card/80 backdrop-blur">
        <div className="h-24 animate-pulse bg-muted/20 rounded-lg" />
      </Card>
    )
  }

  if (uvIndex === null) return null

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: t.uvLow, color: "text-green-500", bg: "bg-green-500/10" }
    if (uv <= 5) return { level: t.uvModerate, color: "text-yellow-500", bg: "bg-yellow-500/10" }
    if (uv <= 7) return { level: t.uvHigh, color: "text-orange-500", bg: "bg-orange-500/10" }
    if (uv <= 10) return { level: t.uvVeryHigh, color: "text-red-500", bg: "bg-red-500/10" }
    return { level: t.uvExtreme, color: "text-purple-500", bg: "bg-purple-500/10" }
  }

  const uvLevel = getUVLevel(uvIndex)

  return (
    <Card
      className={`p-6 bg-card/80 backdrop-blur ${uvLevel.bg} border-2 animate-in fade-in slide-in-from-bottom-4 duration-700`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sun className={`w-8 h-8 ${uvLevel.color}`} />
          <div>
            <h3 className="text-xl font-semibold">{t.uvIndex}</h3>
            <p className="text-sm text-muted-foreground">{t.uvDescription}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${uvLevel.color}`}>{uvIndex.toFixed(1)}</div>
          <p className={`text-lg font-semibold ${uvLevel.color}`}>{uvLevel.level}</p>
        </div>
      </div>
      {uvIndex > 5 && (
        <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{t.uvWarning}</p>
        </div>
      )}
    </Card>
  )
}
