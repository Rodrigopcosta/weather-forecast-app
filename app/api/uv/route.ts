import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Coordenadas não especificadas" }, { status: 400 })
  }

  const apiKey = process.env.OPENWEATHER_API_KEY || "demo"

  try {
    const url = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`

    const response = await fetch(url, { next: { revalidate: 3600 } })

    if (!response.ok) {
      throw new Error("Dados UV não encontrados")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar índice UV" }, { status: 500 })
  }
}
