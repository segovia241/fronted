import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// GET /api/productos - Listar todos los productos
export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/productos`)
    if (!res.ok) {
      throw new Error("Error al obtener productos desde la API")
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al obtener los productos" }, { status: 500 })
  }
}

// POST /api/productos - Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.descripcion || body.costo === undefined || body.precio === undefined || body.cantidad === undefined) {
      return NextResponse.json(
        { error: "Los campos descripcion, costo, precio y cantidad son obligatorios" },
        { status: 400 }
      )
    }

    console.log("Enviando POST a backend con payload:", body)

    const res = await fetch(`${API_BASE_URL}/api/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("Error al crear producto:", errorData)
      return NextResponse.json(
        { error: errorData.error || "Error al crear el producto en la API" },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json({ error: "Error al crear el producto" }, { status: 500 })
  }
}
