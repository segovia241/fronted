import { DetallePedido } from "@/lib/data"
import { type NextRequest, NextResponse } from "next/server"

// Base de datos en memoria para detalles de pedidos
// Eliminar esta línea:
const detallesPedidos: DetallePedido[] = []

// GET /api/detalle-pedidos - Listar todos los detalles de pedidos
export async function GET(request: NextRequest) {
  try {
    // Opcionalmente filtrar por idPedido si se proporciona como query param
    const { searchParams } = new URL(request.url)
    const idPedido = searchParams.get("idPedido")

    if (idPedido) {
      const detallesFiltrados = detallesPedidos.filter((detalle) => detalle.idPedido === idPedido)
      return NextResponse.json(detallesFiltrados)
    }

    return NextResponse.json(detallesPedidos)
  } catch (error) {
    console.error("Error al obtener detalles de pedidos:", error)
    return NextResponse.json({ error: "Error al obtener los detalles de pedidos" }, { status: 500 })
  }
}

// POST /api/detalle-pedidos - Crear un nuevo detalle de pedido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos requeridos
    if (
      !body.idPedido ||
      !body.idProducto ||
      body.cantidad === undefined ||
      body.precio === undefined ||
      body.totalDeta === undefined
    ) {
      return NextResponse.json(
        { error: "Los campos idPedido, idProducto, cantidad, precio y totalDeta son obligatorios" },
        { status: 400 },
      )
    }

    // Generar un nuevo ID
    const idDetalle = body.idDetalle || `d${(detallesPedidos.length + 1).toString().padStart(3, "0")}`

    // Crear nuevo detalle de pedido
    const newDetail = {
      idDetalle,
      idPedido: body.idPedido,
      idProducto: body.idProducto,
      cantidad: Number.parseInt(body.cantidad),
      precio: Number.parseFloat(body.precio),
      totalDeta: Number.parseFloat(body.totalDeta),
      descripcion: body.descripcion || "",
    }

    // Añadir a la lista de detalles
    detallesPedidos.push(newDetail)

    // En una aplicación real, aquí actualizaríamos el stock del producto

    return NextResponse.json(newDetail, { status: 201 })
  } catch (error) {
    console.error("Error al crear detalle de pedido:", error)
    return NextResponse.json({ error: "Error al crear el detalle de pedido" }, { status: 500 })
  }
}
