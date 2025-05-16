import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// GET /api/pedidos - Obtener todos los pedidos
export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pedidos`)
    if (!res.ok) {
      throw new Error("Error al obtener los pedidos desde la API")
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    return NextResponse.json({ error: "Error al obtener los pedidos" }, { status: 500 })
  }
}

// POST /api/pedidos - Crear o actualizar un pedido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos requeridos
    if (!body.cliente || !body.cliente.idCliente || !body.fecha) {
      return NextResponse.json({ error: "Los campos cliente.idCliente y fecha son obligatorios" }, { status: 400 })
    }

    // Si tiene ID, es una actualización
    const isUpdate = body.idPedido && body.idPedido !== ""
    console.log(`${isUpdate ? "Actualizando" : "Creando"} pedido con datos:`, body)

    // Enviar a la API
    const res = await fetch(`${API_BASE_URL}/api/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error(`Error al ${isUpdate ? "actualizar" : "crear"} el pedido en la API`)
    }

    const data = await res.json()
    console.log(`Pedido ${isUpdate ? "actualizado" : "creado"} en el backend:`, data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al procesar pedido:", error)
    return NextResponse.json({ error: "Error al procesar el pedido" }, { status: 500 })
  }
}
