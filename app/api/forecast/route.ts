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
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`,
      { next: { revalidate: 1800 } }, // Cache por 30 minutos
    )

    if (!response.ok) {
      throw new Error("Previsão não encontrada")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar previsão" }, { status: 500 })
  }
}
