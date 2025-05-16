import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// GET /api/pedidos/[id] - Obtener un pedido específico
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const res = await fetch(`${API_BASE_URL}/api/pedidos/${id}`)

    if (!res.ok) {
      throw new Error("Error al obtener el pedido desde la API")
    }

    const data = await res.json()
    console.log(`Pedido ${id} obtenido del backend:`, data)
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error al obtener pedido ${params.id}:`, error)
    return NextResponse.json({ error: "Error al obtener el pedido" }, { status: 500 })
  }
}

// PUT /api/pedidos/[id] - Actualizar un pedido existente
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    if (!body.cliente || !body.cliente.idCliente || !body.fecha) {
      return NextResponse.json({ error: "Los campos cliente.idCliente y fecha son obligatorios" }, { status: 400 })
    }

    console.log(`Enviando actualización para pedido ${id} con payload:`, body)

    // Verificar que el pedido existe
    const checkRes = await fetch(`${API_BASE_URL}/api/pedidos/${id}`)
    if (!checkRes.ok) {
      return NextResponse.json({ error: "El pedido no existe" }, { status: 404 })
    }

    // Actualizar el pedido
    const res = await fetch(`${API_BASE_URL}/api/pedidos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error("Error al actualizar el pedido en la API")
    }

    const updatedOrder = await res.json()
    console.log(`Pedido ${id} actualizado en el backend:`, updatedOrder)
    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error(`Error al actualizar pedido ${params.id}:`, error)
    return NextResponse.json({ error: "Error al actualizar el pedido" }, { status: 500 })
  }
}

// DELETE /api/pedidos/[id] - Eliminar un pedido
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    console.log(`Intentando eliminar pedido ${id}`)

    // Verificar que el pedido existe
    const checkRes = await fetch(`${API_BASE_URL}/api/pedidos/${id}`)
    if (!checkRes.ok) {
      return NextResponse.json({ error: "El pedido no existe" }, { status: 404 })
    }

    // Primero eliminar los detalles del pedido
    console.log(`Eliminando detalles del pedido ${id}`)
    await fetch(`${API_BASE_URL}/api/detalles/${id}`, {
      method: "DELETE",
    })

    // Luego eliminar el pedido
    const res = await fetch(`${API_BASE_URL}/api/pedidos/${id}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      throw new Error("Error al eliminar el pedido en la API")
    }

    console.log(`Pedido ${id} eliminado correctamente`)
    return NextResponse.json({ success: true, message: "Pedido eliminado correctamente" })
  } catch (error) {
    console.error(`Error al eliminar pedido ${params.id}:`, error)
    return NextResponse.json({ error: "Error al eliminar el pedido" }, { status: 500 })
  }
}
