import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// Añadir console.log después de obtener detalles de pedido
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const idPedido = searchParams.get("idPedido")

  if (!idPedido) {
    return NextResponse.json({ error: "Se requiere el ID del pedido" }, { status: 400 })
  }

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9090"
    console.log(`Obteniendo detalles para el pedido ${idPedido}`)
    const response = await fetch(`${apiBaseUrl}/api/detalles/${idPedido}`)

    if (!response.ok) {
      throw new Error(`Error al obtener detalles del pedido: ${response.status}`)
    }

    const data = await response.json()
    console.log(`Detalles del pedido ${idPedido} obtenidos del backend:`, data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en la API de detalles de pedido:", error)
    return NextResponse.json({ error: "Error al obtener los detalles del pedido" }, { status: 500 })
  }
}

// Añadir console.log para la creación de detalles de pedido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.idPedido || !body.idProd || body.cantidad === undefined || body.precio === undefined) {
      return NextResponse.json(
        { error: "Los campos idPedido, idProd, cantidad y precio son obligatorios" },
        { status: 400 },
      )
    }

    console.log("Enviando POST a backend para crear detalle de pedido con payload:", body)

    const res = await fetch(`${API_BASE_URL}/api/detalle-pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error("Error al crear el detalle de pedido en la API")
    }

    const data = await res.json()
    console.log("Detalle de pedido creado en el backend:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating detalle-pedido:", error)
    return NextResponse.json({ error: "Error al crear el detalle de pedido" }, { status: 500 })
  }
}
