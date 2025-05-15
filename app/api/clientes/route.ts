import { type NextRequest, NextResponse } from "next/server"

// GET /api/clientes - Obtener todos los clientes
export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clientes`)
    if (!res.ok) {
      throw new Error("Error al obtener los clientes desde la API")
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al obtener clientes:", error)
    return NextResponse.json({ error: "Error al obtener los clientes" }, { status: 500 })
  }
}

// POST /api/clientes - Crear o actualizar un cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos requeridos
    if (!body.apellidos || !body.nombres || !body.dni) {
      return NextResponse.json({ error: "Los campos apellidos, nombres y dni son obligatorios" }, { status: 400 })
    }

    // Si tiene ID, es una actualización
    const isUpdate = body.idCliente && body.idCliente !== ""
    console.log(`${isUpdate ? "Actualizando" : "Creando"} cliente con datos:`, body)

    // Enviar a la API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error(`Error al ${isUpdate ? "actualizar" : "crear"} el cliente en la API`)
    }

    const data = await res.json()
    console.log(`Cliente ${isUpdate ? "actualizado" : "creado"} en el backend:`, data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al procesar cliente:", error)
    return NextResponse.json({ error: "Error al procesar el cliente" }, { status: 500 })
  }
}
