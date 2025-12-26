"use client"

import { Languages } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type Language = "pt" | "en" | "es"

const languages = {
  pt: { name: "Português", flag: "🇧🇷" },
  en: { name: "English", flag: "🇺🇸" },
  es: { name: "Español", flag: "🇪🇸" },
}

export function LanguageToggle() {
  const [language, setLanguage] = useState<Language>("pt")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language | null
    if (savedLang) {
      setLanguage(savedLang)
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    window.dispatchEvent(new CustomEvent("languageChange", { detail: lang }))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-20 z-50 rounded-full w-12 h-12 shadow-lg hover:scale-110 transition-transform bg-transparent"
        >
          <Languages className="h-5 w-5" />
          <span className="sr-only">Alterar idioma</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, { name, flag }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => changeLanguage(code as Language)}
            className={language === code ? "bg-accent" : ""}
          >
            <span className="mr-2">{flag}</span>
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
