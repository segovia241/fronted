import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// GET /api/detalles/[id] - Obtener los detalles de un pedido específico
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const res = await fetch(`${API_BASE_URL}/api/detalles/${id}`)

    if (!res.ok) {
      throw new Error("Error al obtener los detalles del pedido desde la API")
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error al obtener detalles del pedido ${params.id}:`, error)
    return NextResponse.json({ error: "Error al obtener los detalles del pedido" }, { status: 500 })
  }
}

// DELETE /api/detalles/[id] - Eliminar los detalles de un pedido
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const res = await fetch(`${API_BASE_URL}/api/detalles/${id}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      throw new Error("Error al eliminar los detalles del pedido en la API")
    }

    return NextResponse.json({ success: true, message: "Detalles del pedido eliminados correctamente" })
  } catch (error) {
    console.error(`Error al eliminar detalles del pedido ${params.id}:`, error)
    return NextResponse.json({ error: "Error al eliminar los detalles del pedido" }, { status: 500 })
  }
}
