"use client"

import { Suspense, useState, useEffect } from "react"
import { WeatherSearch } from "@/components/weather-search"
import { Cloud } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useTranslations, type Language } from "@/lib/translations"

export default function Home() {
  const [language, setLanguage] = useState<Language>("pt")
  const t = useTranslations(language)

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

  return (
    <main className="min-h-screen bg-linear-to-br from-primary/10 via-background to-accent/10">
      <ThemeToggle />
      <LanguageToggle />

      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold text-balance">{t.title}</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">{t.subtitle}</p>
        </header>

        <Suspense fallback={<div className="text-center">Carregando...</div>}>
          <WeatherSearch />
        </Suspense>
      </div>
    </main>
  )
}
