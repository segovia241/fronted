import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// GET /api/productos - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/productos`)
    if (!res.ok) {
      throw new Error("Error al obtener los productos desde la API")
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al obtener los productos" }, { status: 500 })
  }
}

// POST /api/productos - Crear o actualizar un producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos requeridos
    if (!body.descripcion || body.costo === undefined || body.precio === undefined || body.cantidad === undefined) {
      return NextResponse.json(
        { error: "Los campos descripcion, costo, precio y cantidad son obligatorios" },
        { status: 400 },
      )
    }

    // Si tiene ID, es una actualización
    const isUpdate = body.idProducto && body.idProducto !== ""
    console.log(`${isUpdate ? "Actualizando" : "Creando"} producto con datos:`, body)

    // Enviar a la API
    const res = await fetch(`${API_BASE_URL}/api/productos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error(`Error al ${isUpdate ? "actualizar" : "crear"} el producto en la API`)
    }

    const data = await res.json()
    console.log(`Producto ${isUpdate ? "actualizado" : "creado"} en el backend:`, data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al procesar producto:", error)
    return NextResponse.json({ error: "Error al procesar el producto" }, { status: 500 })
  }
}
