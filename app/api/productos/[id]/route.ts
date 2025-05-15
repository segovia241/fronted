import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// GET /api/productos/[id] - Obtener un producto específico
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const res = await fetch(`${API_BASE_URL}/api/productos/${id}`)

    if (!res.ok) {
      throw new Error("Error al obtener el producto desde la API")
    }

    const data = await res.json()
    console.log(`Producto ${id} obtenido del backend:`, data)
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error al obtener producto ${params.id}:`, error)
    return NextResponse.json({ error: "Error al obtener el producto" }, { status: 500 })
  }
}

// PUT /api/productos/[id] - Actualizar un producto existente
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    if (!body.descripcion || body.costo === undefined || body.precio === undefined || body.cantidad === undefined) {
      return NextResponse.json(
        { error: "Los campos descripcion, costo, precio y cantidad son obligatorios" },
        { status: 400 },
      )
    }

    console.log(`Enviando actualización para producto ${id} con payload:`, body)

    // Verificar que el producto existe
    const checkRes = await fetch(`${API_BASE_URL}/api/productos/${id}`)
    if (!checkRes.ok) {
      return NextResponse.json({ error: "El producto no existe" }, { status: 404 })
    }

    // Actualizar el producto
    const res = await fetch(`${API_BASE_URL}/api/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error("Error al actualizar el producto en la API")
    }

    const updatedProduct = await res.json()
    console.log(`Producto ${id} actualizado en el backend:`, updatedProduct)
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error(`Error al actualizar producto ${params.id}:`, error)
    return NextResponse.json({ error: "Error al actualizar el producto" }, { status: 500 })
  }
}

// DELETE /api/productos/[id] - Eliminar un producto
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    console.log(`Intentando eliminar producto ${id}`)

    // Verificar que el producto existe
    const checkRes = await fetch(`${API_BASE_URL}/api/productos/${id}`)
    if (!checkRes.ok) {
      return NextResponse.json({ error: "El producto no existe" }, { status: 404 })
    }

    // Eliminar el producto
    const res = await fetch(`${API_BASE_URL}/api/productos/${id}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      throw new Error("Error al eliminar el producto en la API")
    }

    console.log(`Producto ${id} eliminado correctamente`)
    return NextResponse.json({ success: true, message: "Producto eliminado correctamente" })
  } catch (error) {
    console.error(`Error al eliminar producto ${params.id}:`, error)
    return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 })
  }
}
