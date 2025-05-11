import { type NextRequest, NextResponse } from "next/server"

// GET /api/clientes - Listar todos los clientes
export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clientes`, {
      method: "GET",
    })

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

// POST /api/clientes - Crear un nuevo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos requeridos
    if (!body.apellidos || !body.nombres || !body.dni) {
      return NextResponse.json({ error: "Los campos apellidos, nombres y dni son obligatorios" }, { status: 400 })
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error("Error al crear el cliente en la API")
    }

    const createdClient = await res.json()
    return NextResponse.json(createdClient, { status: 201 })
  } catch (error) {
    console.error("Error al crear cliente:", error)
    return NextResponse.json({ error: "Error al crear el cliente" }, { status: 500 })
  }
}
