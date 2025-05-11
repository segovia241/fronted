import { type NextRequest, NextResponse } from "next/server"
import { fetchDniData, fetchRucData } from "@/lib/api-client"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type")
  const number = searchParams.get("number")

  if (!type || !number) {
    return NextResponse.json({ error: "Se requiere tipo y número de documento" }, { status: 400 })
  }

  try {
    let data

    if (type === "dni") {
      data = await fetchDniData(number)
    } else if (type === "ruc") {
      data = await fetchRucData(number)
    } else {
      return NextResponse.json({ error: 'Tipo de documento no válido. Use "dni" o "ruc"' }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error(`Error fetching ${type} data:`, error)
    return NextResponse.json({ error: error.message || `Error al consultar el ${type.toUpperCase()}` }, { status: 500 })
  }
}
