import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Previsão do Tempo | Clima ao seu alcance",
  description: "Confira a previsão do tempo para sua cidade e planeje seu dia com precisão",
  generator: "Rodrigo Costa – Next.js Project",
  keywords: ["previsão do tempo", "clima", "temperatura", "weather app", "tempo real"],
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
    apple: "/icon.png",
  },
  openGraph: {
    title: "Previsão do Tempo",
    description: "Aplicativo de previsão do tempo em tempo real",
    url: "https://weather-forecast-app-rho-nine.vercel.app/",
    siteName: "Previsão do Tempo",
    images: [
      {
        url: "https://weather-forecast-app-rho-nine.vercel.app/assets/screenshot-desktop.png",
        width: 1200,
        height: 630,
        alt: "Previsão do Tempo Desktop",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Previsão do Tempo",
    description: "Aplicativo de previsão do tempo em tempo real",
    images: ["https://weather-forecast-app-rho-nine.vercel.app/assets/screenshot-desktop.png"],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Previsão do Tempo",
              "url": "https://weather-forecast-app-rho-nine.vercel.app/",
              "applicationCategory": "WeatherApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "BRL",
              },
            }),
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
