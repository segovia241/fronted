import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// GET /api/pedidos - Listar todos los pedidos
export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/pedidos`)
    if (!res.ok) {
      throw new Error("Error al obtener pedidos desde la API")
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    return NextResponse.json({ error: "Error al obtener los pedidos" }, { status: 500 })
  }
}

// POST /api/pedidos - Crear un nuevo pedido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (
      !body.cliente ||
      !body.cliente.idCliente ||
      !body.fecha ||
      body.subTotal === undefined ||
      body.totalVenta === undefined
    ) {
      return NextResponse.json(
        { error: "Los campos cliente.idCliente, fecha, subTotal y totalVenta son obligatorios" },
        { status: 400 }
      )
    }

    const res = await fetch(`${API_BASE_URL}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error("Error al crear el pedido en la API")
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error al crear pedido:", error)
    return NextResponse.json({ error: "Error al crear el pedido" }, { status: 500 })
  }
}
