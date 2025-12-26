"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, MapPin, History, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { WeatherDisplay } from "@/components/weather-display"
import { Badge } from "@/components/ui/badge"
import { useTranslations, languageToCountry, type Language } from "@/lib/translations"

export interface WeatherData {
  name: string
  sys: {
    country: string
  }
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
    temp_min: number
    temp_max: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  wind: {
    speed: number
  }
  clouds: {
    all: number
  }
  coord: {
    lat: number
    lon: number
  }
  visibility?: number
  rain?: {
    "1h"?: number
    "3h"?: number
  }
}

export function WeatherSearch() {
  const [language, setLanguage] = useState<Language>("pt")
  const t = useTranslations(language)

  const [city, setCity] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [geoLoading, setGeoLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language | null
    if (savedLang) {
      setLanguage(savedLang)
    }

    const handleLanguageChange = (e: CustomEvent<Language>) => {
      setLanguage(e.detail)
    }

    window.addEventListener("languageChange", handleLanguageChange as EventListener)
    return () => window.removeEventListener("languageChange", handleLanguageChange as EventListener)
  }, [])

  useEffect(() => {
    const history = localStorage.getItem("weatherSearchHistory")
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  const addToHistory = (cityName: string) => {
    const newHistory = [cityName, ...searchHistory.filter((c) => c !== cityName)].slice(0, 5)
    setSearchHistory(newHistory)
    localStorage.setItem("weatherSearchHistory", JSON.stringify(newHistory))
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("weatherSearchHistory")
  }

  const searchWeather = async (searchCity: string) => {
    if (!searchCity.trim()) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(searchCity)}`)

      if (!response.ok) {
        throw new Error("Cidade não encontrada")
      }

      const data = await response.json()
      setWeather(data)
      addToHistory(data.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar previsão do tempo")
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await searchWeather(city)
  }

  const searchByLocation = async () => {
    setGeoLoading(true)
    setError("")

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const { latitude, longitude } = position.coords
      const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)

      if (!response.ok) {
        throw new Error("Não foi possível obter o clima da sua localização")
      }

      const data = await response.json()
      setWeather(data)
      setCity(data.name)
      addToHistory(data.name)
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        setError("Permissão de localização negada")
      } else {
        setError("Erro ao obter sua localização")
      }
    } finally {
      setGeoLoading(false)
    }
  }

  const fetchCitySuggestions = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(`/api/cities?q=${encodeURIComponent(searchTerm)}&limit=20`)

      if (response.ok) {
        const data = await response.json()

        const preferredCountries = languageToCountry[language]
        const prioritized = data.sort((a: any, b: any) => {
          const aPreferred = preferredCountries.includes(a.country)
          const bPreferred = preferredCountries.includes(b.country)

          if (aPreferred && !bPreferred) return -1
          if (!aPreferred && bPreferred) return 1
          return 0
        })

        const cityNames = prioritized
          .slice(0, 5)
          .map((city: any) => `${city.name}${city.state ? ", " + city.state : ""}, ${city.country}`)
        setSuggestions(cityNames)
      }
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error)
    }
  }

  const handleCityChange = (value: string) => {
    setCity(value)
    setShowSuggestions(true)
    fetchCitySuggestions(value)
  }

  const selectSuggestion = (suggestion: string) => {
    setCity(suggestion)
    setShowSuggestions(false)
    setSuggestions([])
    searchWeather(suggestion)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder={t.searchPlaceholder}
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10 h-14 text-lg bg-card"
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button type="submit" size="lg" disabled={loading} className="h-14 px-8">
            {loading ? t.loading : t.searchButton}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={searchByLocation}
            disabled={geoLoading}
            className="h-14 px-6 bg-transparent"
            title={t.useLocation}
          >
            <MapPin className="w-5 h-5" />
          </Button>
        </div>
      </form>

      {searchHistory.length > 0 && !weather && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <History className="w-4 h-4" />
              <span>{t.recentSearches}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={clearHistory} className="h-auto py-1 px-2 text-xs">
              <X className="w-3 h-3 mr-1" />
              {t.clearHistory}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((historyCity, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5"
                onClick={() => {
                  setCity(historyCity)
                  searchWeather(historyCity)
                }}
              >
                {historyCity}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-lg mb-8 text-center animate-in fade-in slide-in-from-top-2 duration-300">
          {error}
        </div>
      )}

      {weather && <WeatherDisplay weather={weather} language={language} />}
    </div>
  )
}
