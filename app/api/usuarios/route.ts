import { type NextRequest, NextResponse } from "next/server"

// Base de datos en memoria para usuarios
const usuarios = [
  {
    idUsuario: "admin",
    passwd: "admin", // En una aplicación real, esto estaría hasheado
  },
]

// GET /api/usuarios - Listar todos los usuarios (sin contraseñas)
export async function GET() {
  try {
    const usuariosSeguros = usuarios.map(({ passwd, ...rest }) => rest)
    return NextResponse.json(usuariosSeguros)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ error: "Error al obtener los usuarios" }, { status: 500 })
  }
}

// POST /api/usuarios - Crear un nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.idUsuario || !body.passwd) {
      return NextResponse.json({ error: "Los campos idUsuario y passwd son obligatorios" }, { status: 400 })
    }

    const usuarioExiste = usuarios.some((u) => u.idUsuario === body.idUsuario)
    if (usuarioExiste) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 })
    }

    const newUser = {
      idUsuario: body.idUsuario,
      passwd: body.passwd,
    }

    usuarios.push(newUser)

    const { passwd, ...usuarioSeguro } = newUser
    return NextResponse.json(usuarioSeguro, { status: 201 })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 })
  }
}
