import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const idPedido = searchParams.get("idPedido")

  if (!idPedido) {
    return NextResponse.json({ error: "Se requiere el ID del pedido" }, { status: 400 })
  }

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9090"
    const response = await fetch(`${apiBaseUrl}/api/detalles/${idPedido}`)

    if (!response.ok) {
      throw new Error(`Error al obtener detalles del pedido: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en la API de detalles de pedido:", error)
    return NextResponse.json({ error: "Error al obtener los detalles del pedido" }, { status: 500 })
  }
}
