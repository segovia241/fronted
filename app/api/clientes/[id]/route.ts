import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// GET /api/clientes/[id] - Obtener un cliente específico
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const res = await fetch(`${API_BASE_URL}/api/clientes/${id}`)

    if (!res.ok) {
      throw new Error("Error al obtener el cliente desde la API")
    }

    const data = await res.json()
    console.log(`Cliente ${id} obtenido del backend:`, data)
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error al obtener cliente ${params.id}:`, error)
    return NextResponse.json({ error: "Error al obtener el cliente" }, { status: 500 })
  }
}

// PUT /api/clientes/[id] - Actualizar un cliente existente
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    if (!body.apellidos || !body.nombres || !body.dni) {
      return NextResponse.json({ error: "Los campos apellidos, nombres y dni son obligatorios" }, { status: 400 })
    }

    console.log(`Enviando actualización para cliente ${id} con payload:`, body)

    // Verificar que el cliente existe
    const checkRes = await fetch(`${API_BASE_URL}/api/clientes/${id}`)
    if (!checkRes.ok) {
      return NextResponse.json({ error: "El cliente no existe" }, { status: 404 })
    }

    // Actualizar el cliente
    const res = await fetch(`${API_BASE_URL}/api/clientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error("Error al actualizar el cliente en la API")
    }

    const updatedClient = await res.json()
    console.log(`Cliente ${id} actualizado en el backend:`, updatedClient)
    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error(`Error al actualizar cliente ${params.id}:`, error)
    return NextResponse.json({ error: "Error al actualizar el cliente" }, { status: 500 })
  }
}

// DELETE /api/clientes/[id] - Eliminar un cliente
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    console.log(`Intentando eliminar cliente ${id}`)

    // Verificar que el cliente existe
    const checkRes = await fetch(`${API_BASE_URL}/api/clientes/${id}`)
    if (!checkRes.ok) {
      return NextResponse.json({ error: "El cliente no existe" }, { status: 404 })
    }

    // Eliminar el cliente
    const res = await fetch(`${API_BASE_URL}/api/clientes/${id}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      throw new Error("Error al eliminar el cliente en la API")
    }

    console.log(`Cliente ${id} eliminado correctamente`)
    return NextResponse.json({ success: true, message: "Cliente eliminado correctamente" })
  } catch (error) {
    console.error(`Error al eliminar cliente ${params.id}:`, error)
    return NextResponse.json({ error: "Error al eliminar el cliente" }, { status: 500 })
  }
}
