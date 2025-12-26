import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city")
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!city && (!lat || !lon)) {
    return NextResponse.json({ error: "Cidade ou coordenadas não especificadas" }, { status: 400 })
  }

  const apiKey = process.env.OPENWEATHER_API_KEY || "demo"

  try {
    let url = `https://api.openweathermap.org/data/2.5/weather?`
    if (city) {
      url += `q=${encodeURIComponent(city)}`
    } else {
      url += `lat=${lat}&lon=${lon}`
    }
    url += `&appid=${apiKey}&units=metric&lang=pt_br`

    const response = await fetch(url, { next: { revalidate: 300 } })

    if (!response.ok) {
      throw new Error("Dados não encontrados")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar dados do clima" }, { status: 500 })
  }
}
